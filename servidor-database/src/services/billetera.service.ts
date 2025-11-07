import { Decimal } from "@prisma/client/runtime/library"
import { envs } from "envs"
import { ConfirmarPagoDto } from "src/dto/confirmar-pago.dto"
import { ConsultarSaldoDto } from "src/dto/consultar-saldo.dto"
import { PagarDto } from "src/dto/pagar.dto"
import { RecargaBilleteraDto } from "src/dto/recarga-billetera.dto"
import { ClienteRepository } from "src/repositories/clienteRepository"
import { SesionCompraRepository } from "src/repositories/sesionCompraRepository"
import { TransaccionRepository } from "src/repositories/transaccionRepository"
import { calcularExpiracion, estaExpirado, generarTokenNumerico } from "src/utils/token.utils"

import { Injectable, Logger } from "@nestjs/common"

import { CustomError } from "~/globals/custom.errors"
import { EnumError400 } from "~/globals/errors"
import { UnitOfWork } from "~/prisma/unit-of-work"
import { TipoTransaccion } from "~prisma/prisma-client"

import { EmailService } from "./email.service"

@Injectable()
export class BilleteraService {
  private readonly logger = new Logger(BilleteraService.name)

  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly clienteRepository: ClienteRepository,
    private readonly transaccionRepository: TransaccionRepository,
    private readonly sesionCompraRepository: SesionCompraRepository,
    private readonly emailService: EmailService
  ) {
    this.logger.log("> Instancia creada para <BilleteraService>")
  }

  /**
   * Recargar saldo a la billetera de un cliente
   */
  async recargarBilletera(dto: RecargaBilleteraDto) {
    this.logger.log(`Recarga solicitada - Documento: ${dto.documento}, Monto: ${dto.monto}`)

    // Validar que el cliente exista con documento y celular
    const cliente = await this.clienteRepository.findByDocumentoAndCelular(
      dto.documento,
      dto.celular
    )

    if (!cliente) {
      this.logger.warn(`Cliente no encontrado: ${dto.documento}`)
      throw new CustomError(EnumError400.ClienteDocumentoCelularNoCoinciden)
    }

    // Validar monto positivo
    if (dto.monto <= 0) {
      throw new CustomError(EnumError400.MontoInvalido)
    }

    const montoDecimal = new Decimal(dto.monto)
    const saldoAnterior = cliente.saldo.toString()

    // Ejecutar incremento de saldo y registro de transacción en una transacción atómica
    const clienteActualizado = await this.unitOfWork.runInTransaction(async () => {
      // Incrementar saldo
      const clienteUpdated = await this.clienteRepository.incrementarSaldo(cliente.id, montoDecimal)

      // Registrar transacción
      await this.transaccionRepository.create({
        clienteId: cliente.id,
        tipo: TipoTransaccion.RECARGA,
        monto: montoDecimal,
        descripcion: `Recarga de billetera`
      })

      return clienteUpdated
    })

    this.logger.log(
      `✅ Recarga exitosa - Cliente: ${cliente.id}, Nuevo saldo: ${clienteActualizado.saldo.toString()}`
    )

    return {
      cliente: {
        documento: clienteActualizado.documento,
        nombres: clienteActualizado.nombres
      },
      montoRecargado: dto.monto,
      saldoAnterior: saldoAnterior,
      saldoNuevo: clienteActualizado.saldo.toString()
    }
  }

  /**
   * Iniciar proceso de pago - Genera token y envía email
   */
  async iniciarPago(dto: PagarDto) {
    this.logger.log(`Pago solicitado - Documento: ${dto.documento}, Monto: ${dto.monto}`)

    // Validar que el cliente exista
    const cliente = await this.clienteRepository.findByDocumentoAndCelular(
      dto.documento,
      dto.celular
    )

    if (!cliente) {
      this.logger.warn(`Cliente no encontrado: ${dto.documento}`)
      throw new CustomError(EnumError400.ClienteDocumentoCelularNoCoinciden)
    }

    // Validar monto positivo
    if (dto.monto <= 0) {
      throw new CustomError(EnumError400.MontoInvalido)
    }

    const montoDecimal = new Decimal(dto.monto)
    const saldoActual = new Decimal(cliente.saldo.toString())

    // Validar saldo suficiente
    if (saldoActual.lessThan(montoDecimal)) {
      this.logger.warn(
        `Saldo insuficiente - Cliente: ${cliente.id}, Saldo: ${saldoActual.toString()}, Monto: ${montoDecimal.toString()}`
      )
      throw new CustomError(EnumError400.SaldoInsuficiente)
    }

    // Generar token de 6 dígitos
    const token = generarTokenNumerico()

    // Calcular expiración (15 minutos por defecto)
    const expiracionMinutos = envs.TOKEN_EXPIRATION_MINUTES
    const expiraEn = calcularExpiracion(expiracionMinutos)

    // Crear sesión de compra
    const sesion = await this.sesionCompraRepository.create({
      clienteId: cliente.id,
      monto: montoDecimal,
      token,
      expiraEn
    })

    this.logger.log(`✅ Sesión de pago creada - ID: ${sesion.id}, Token: ${token}`)

    // Enviar email con el token
    try {
      await this.emailService.enviarTokenPago(
        cliente.email,
        cliente.nombres,
        token,
        dto.monto,
        sesion.id
      )
    } catch (emailError) {
      const errorMessage = emailError instanceof Error ? emailError.message : "Error desconocido"
      this.logger.error(`Error al enviar email: ${errorMessage}`)

      await this.unitOfWork.runInTransaction(async () => {
        await this.sesionCompraRepository.markAsUsed(sesion.id)
      })

      throw emailError
    }

    return {
      id_sesion: sesion.id
    }
  }

  /**
   * Confirmar pago con token
   */
  async confirmarPago(dto: ConfirmarPagoDto) {
    this.logger.log(`Confirmación de pago - Sesión: ${dto.id_sesion}`)

    // Buscar la sesión de compra
    const sesion = await this.sesionCompraRepository.validateToken(dto.id_sesion, dto.token)

    if (!sesion) {
      this.logger.warn(`Token o sesión inválidos: ${dto.id_sesion}`)
      throw new CustomError(EnumError400.TokenInvalido)
    }

    // Verificar si ya fue usada
    if (sesion.usado) {
      this.logger.warn(`Token ya usado: ${dto.id_sesion}`)
      throw new CustomError(EnumError400.SesionYaUsada)
    }

    // Verificar si expiró
    if (estaExpirado(sesion.expiraEn)) {
      this.logger.warn(`Token expirado: ${dto.id_sesion}`)
      throw new CustomError(EnumError400.SesionExpirada)
    }

    const saldoActual = new Decimal(sesion.cliente.saldo.toString())
    const montoPago = new Decimal(sesion.monto.toString())

    if (saldoActual.lessThan(montoPago)) {
      this.logger.warn(`Saldo insuficiente al confirmar: ${sesion.clienteId}`)
      throw new CustomError(EnumError400.SaldoInsuficiente)
    }

    // Ejecutar todas las operaciones en una transacción atómica
    const clienteActualizado = await this.unitOfWork.runInTransaction(async () => {
      // Decrementar saldo
      const cliente = await this.clienteRepository.decrementarSaldo(sesion.clienteId, montoPago)

      // Registrar transacción
      await this.transaccionRepository.create({
        clienteId: sesion.clienteId,
        tipo: TipoTransaccion.COMPRA,
        monto: montoPago,
        descripcion: `Pago confirmado con token - Sesión: ${sesion.id}`
      })

      // Marcar sesión como usada
      await this.sesionCompraRepository.markAsUsed(sesion.id)

      return cliente
    })

    this.logger.log(
      `✅ Pago confirmado exitosamente - Cliente: ${sesion.clienteId}, Monto: ${montoPago.toString()}`
    )

    return {
      cliente: {
        documento: sesion.cliente.documento,
        nombres: sesion.cliente.nombres
      },
      montoDescontado: sesion.monto.toString(),
      saldoAnterior: sesion.cliente.saldo.toString(),
      saldoNuevo: clienteActualizado.saldo.toString(),
      fechaTransaccion: new Date().toISOString()
    }
  }

  /**
   * Consultar saldo de un cliente
   */
  async consultarSaldo(dto: ConsultarSaldoDto) {
    this.logger.log(`Consulta de saldo - Documento: ${dto.documento}`)

    // Buscar cliente con validación de documento y celular
    const cliente = await this.clienteRepository.findByDocumentoAndCelular(
      dto.documento,
      dto.celular
    )

    if (!cliente) {
      this.logger.warn(`Cliente no encontrado: ${dto.documento}`)
      throw new CustomError(EnumError400.ClienteDocumentoCelularNoCoinciden)
    }

    const estadisticas = await this.transaccionRepository.getEstadisticasCliente(cliente.id)

    this.logger.log(`✅ Consulta de saldo exitosa - Cliente: ${cliente.id}`)

    return {
      cliente: {
        documento: cliente.documento,
        nombres: cliente.nombres,
        email: this.ocultarEmail(cliente.email)
      },
      saldo: cliente.saldo.toString(),
      estadisticas: {
        totalRecargas: estadisticas.totalRecargas.toString(),
        totalCompras: estadisticas.totalCompras.toString(),
        numeroRecargas: estadisticas.numeroRecargas,
        numeroCompras: estadisticas.numeroCompras
      },
      fechaConsulta: new Date().toISOString()
    }
  }

  /**
   * Ocultar parcialmente un email para privacidad
   */
  private ocultarEmail(email: string): string {
    const [local, dominio] = email.split("@")
    if (local.length <= 2) {
      return `${local[0]}***@${dominio}`
    }
    return `${local[0]}***${local[local.length - 1]}@${dominio}`
  }
}
