import { ApiProperty } from "@nestjs/swagger"

class ClienteRecargaEntity {
  @ApiProperty({ example: "1134854312", description: "Documento del cliente" })
  documento: string

  @ApiProperty({ example: "Juan Pérez García", description: "Nombre del cliente" })
  nombres: string
}

export class RecargaResponseEntity {
  @ApiProperty({ type: ClienteRecargaEntity })
  cliente: ClienteRecargaEntity

  @ApiProperty({ example: 50000, description: "Monto recargado" })
  montoRecargado: number

  @ApiProperty({ example: "100000", description: "Saldo anterior" })
  saldoAnterior: string

  @ApiProperty({ example: "150000", description: "Saldo nuevo" })
  saldoNuevo: string
}
