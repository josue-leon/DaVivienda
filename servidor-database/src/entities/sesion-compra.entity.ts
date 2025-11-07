import { ApiProperty } from "@nestjs/swagger"

import { Prisma } from "~prisma/prisma-client"

type SesionCompraResult = Prisma.SesionCompraGetPayload<null>

export class SesionCompraEntity implements SesionCompraResult {
  @ApiProperty({
    example: "550e8400-e29b-41d4-a716-446655440000",
    description: "ID único de la sesión (UUID)"
  })
  id: string

  @ApiProperty({ example: 1, description: "ID del cliente asociado" })
  clienteId: number

  @ApiProperty({ example: 10000, description: "Monto de la compra", type: "string" })
  monto: Prisma.Decimal

  @ApiProperty({ example: "123456", description: "Token de confirmación de 6 dígitos" })
  token: string

  @ApiProperty({ example: false, description: "Indica si el token ya fue usado" })
  usado: boolean

  @ApiProperty({
    example: "2025-11-05T22:40:26.000Z",
    description: "Fecha y hora de expiración del token"
  })
  expiraEn: Date

  @ApiProperty({
    example: "2025-11-05T22:25:26.000Z",
    description: "Fecha de creación de la sesión"
  })
  createdAt: Date
}
