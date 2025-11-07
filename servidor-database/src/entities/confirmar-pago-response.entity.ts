import { ApiProperty } from "@nestjs/swagger"

class ClienteConfirmacionEntity {
  @ApiProperty({ example: "1234567890", description: "Documento del cliente" })
  documento: string

  @ApiProperty({ example: "Juan Pérez García", description: "Nombre del cliente" })
  nombres: string
}

export class ConfirmarPagoResponseEntity {
  @ApiProperty({ type: ClienteConfirmacionEntity })
  cliente: ClienteConfirmacionEntity

  @ApiProperty({ example: "25000", description: "Monto descontado" })
  montoDescontado: string

  @ApiProperty({ example: "150000", description: "Saldo anterior" })
  saldoAnterior: string

  @ApiProperty({ example: "125000", description: "Saldo nuevo" })
  saldoNuevo: string

  @ApiProperty({ example: "2025-11-05T10:35:00.000Z", description: "Fecha de la transacción" })
  fechaTransaccion: string
}
