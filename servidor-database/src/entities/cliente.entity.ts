import { ApiProperty } from "@nestjs/swagger"

import { Prisma } from "~prisma/prisma-client"

type ClienteResult = Prisma.ClienteGetPayload<null>

export class ClienteEntity implements ClienteResult {
  @ApiProperty({ example: 1, description: "ID único del cliente" })
  id: number

  @ApiProperty({ example: "1134854312", description: "Documento de identidad del cliente" })
  documento: string

  @ApiProperty({ example: "Juan Pérez García", description: "Nombre completo del cliente" })
  nombres: string

  @ApiProperty({ example: "juan.perez@example.com", description: "Email del cliente" })
  email: string

  @ApiProperty({ example: "3001234567", description: "Número de celular del cliente" })
  celular: string

  @ApiProperty({ example: 0, description: "Saldo actual de la billetera", type: "string" })
  saldo: Prisma.Decimal

  @ApiProperty({ example: "2025-11-05T22:25:26.000Z", description: "Fecha de creación" })
  createdAt: Date

  @ApiProperty({
    example: "2025-11-05T22:25:26.000Z",
    description: "Fecha de última actualización"
  })
  updatedAt: Date
}
