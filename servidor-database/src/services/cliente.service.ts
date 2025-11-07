import { RegistroClienteDto } from "src/dto/registro-cliente.dto"
import { ClienteRepository } from "src/repositories/clienteRepository"

import { Injectable, Logger } from "@nestjs/common"

import { CustomError } from "~/globals/custom.errors"
import { EnumError409 } from "~/globals/errors"

import { EmailService } from "./email.service"

@Injectable()
export class ClienteService {
  private readonly logger = new Logger(ClienteService.name)

  constructor(
    private readonly clienteRepository: ClienteRepository,
    private readonly emailService: EmailService
  ) {
    this.logger.log("> Instancia creada para <ClienteService>")
  }

  /**
   * Registrar un nuevo cliente en la billetera virtual
   */
  async registrarCliente(dto: RegistroClienteDto) {
    this.logger.log(`Intentando registrar cliente con documento: ${dto.documento}`)

    const existeDocumento = await this.clienteRepository.existsByDocumento(dto.documento)
    if (existeDocumento) {
      this.logger.warn(`Documento duplicado: ${dto.documento}`)
      throw new CustomError(EnumError409.DocumentoYaRegistrado)
    }

    const existeEmail = await this.clienteRepository.existsByEmail(dto.email)
    if (existeEmail) {
      this.logger.warn(`Email duplicado: ${dto.email}`)
      throw new CustomError(EnumError409.EmailYaRegistrado)
    }

    const nuevoCliente = await this.clienteRepository.create({
      documento: dto.documento,
      nombres: dto.nombres,
      email: dto.email,
      celular: dto.celular
    })

    this.logger.log(`✅ Cliente registrado exitosamente: ${nuevoCliente.id}`)

    // Enviar email de bienvenida (no bloqueante)
    this.emailService
      .enviarEmailBienvenida(nuevoCliente.email, nuevoCliente.nombres)
      .catch((error) => {
        const errorMessage = error instanceof Error ? error.message : "Error desconocido"
        this.logger.warn(`No se pudo enviar email de bienvenida: ${errorMessage}`)
      })

    return nuevoCliente
  }

  /**
   * Buscar cliente por documento (para operaciones internas)
   */
  async buscarPorDocumento(documento: string) {
    return this.clienteRepository.findByDocumento(documento)
  }

  /**
   * Buscar cliente por documento y celular (validación de identidad)
   */
  async buscarPorDocumentoYCelular(documento: string, celular: string) {
    return this.clienteRepository.findByDocumentoAndCelular(documento, celular)
  }

  async obtenerClientes() {
    return this.clienteRepository.obtenerClientes()
  }
}
