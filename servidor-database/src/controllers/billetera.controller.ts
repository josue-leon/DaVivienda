import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from "@nestjs/common"
import { ApiOkResponse, ApiOperation, ApiQuery, ApiSecurity, ApiTags } from "@nestjs/swagger"

import { ConfirmarPagoDto } from "../dto/confirmar-pago.dto"
import { ConsultarSaldoDto } from "../dto/consultar-saldo.dto"
import { PagarDto } from "../dto/pagar.dto"
import { RecargaBilleteraDto } from "../dto/recarga-billetera.dto"
import { ConfirmarPagoResponseEntity } from "../entities/confirmar-pago-response.entity"
import { PagoIniciadoEntity } from "../entities/pago-iniciado.entity"
import { RecargaResponseEntity } from "../entities/recarga-response.entity"
import { SaldoResponseEntity } from "../entities/saldo-response.entity"
import { BilleteraService } from "../services/billetera.service"

@ApiTags("Billetera")
@ApiSecurity("api-key")
@Controller("billetera")
export class BilleteraController {
  constructor(private readonly billeteraService: BilleteraService) {}

  @Post("recarga")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Recargar saldo a la billetera",
    description:
      "Carga dinero a la billetera de un cliente. Requiere documento, celular y monto mayor a 0."
  })
  @ApiOkResponse({ type: RecargaResponseEntity })
  async recargarBilletera(@Body() dto: RecargaBilleteraDto): Promise<RecargaResponseEntity> {
    return this.billeteraService.recargarBilletera(dto)
  }

  @Post("pagar")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Iniciar proceso de pago",
    description:
      "Genera un token de 6 dígitos y lo envía al email del cliente. El token expira en 15 minutos y solo se puede usar una vez."
  })
  @ApiOkResponse({ type: PagoIniciadoEntity })
  async iniciarPago(@Body() dto: PagarDto): Promise<PagoIniciadoEntity> {
    return this.billeteraService.iniciarPago(dto)
  }

  @Post("confirmar-pago")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Confirmar pago con token",
    description:
      "Confirma el pago usando el ID de sesión y el token recibido por email. Valida que no esté expirado ni usado, y descuenta el monto del saldo."
  })
  @ApiOkResponse({ type: ConfirmarPagoResponseEntity })
  async confirmarPago(@Body() dto: ConfirmarPagoDto): Promise<ConfirmarPagoResponseEntity> {
    return this.billeteraService.confirmarPago(dto)
  }

  @Get("saldo")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Consultar saldo de la billetera",
    description:
      "Consulta el saldo actual de un cliente e incluye estadísticas de transacciones (recargas y compras)."
  })
  @ApiOkResponse({ type: SaldoResponseEntity })
  @ApiQuery({
    name: "documento",
    required: true,
    description: "Número de documento del cliente",
    example: "12345678"
  })
  @ApiQuery({
    name: "celular",
    required: true,
    description: "Número de celular del cliente",
    example: "3001234567"
  })
  async consultarSaldo(
    @Query("documento") documento: string,
    @Query("celular") celular: string
  ): Promise<SaldoResponseEntity> {
    const dto: ConsultarSaldoDto = { documento, celular }
    return this.billeteraService.consultarSaldo(dto)
  }
}
