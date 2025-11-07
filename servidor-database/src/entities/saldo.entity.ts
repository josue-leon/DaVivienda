import { ApiProperty } from "@nestjs/swagger"

import { Prisma } from "~prisma/prisma-client"

export class SaldoEntity {
  @ApiProperty({ example: "1234567890", description: "Documento del cliente" })
  documento: string

  @ApiProperty({ example: "Juan Pérez García", description: "Nombre del cliente" })
  nombres: string

  @ApiProperty({ example: 100000, description: "Saldo actual de la billetera", type: "string" })
  saldo: Prisma.Decimal
}
