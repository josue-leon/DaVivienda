import { ApiProperty } from "@nestjs/swagger"

import { Prisma, TipoTransaccion } from "~prisma/prisma-client"

type TransaccionResult = Prisma.TransaccionGetPayload<null>

export class TransaccionEntity implements TransaccionResult {
  @ApiProperty({ example: 1, description: "ID único de la transacción" })
  id: number

  @ApiProperty({ example: 1, description: "ID del cliente asociado" })
  clienteId: number

  @ApiProperty({
    enum: TipoTransaccion,
    example: TipoTransaccion.RECARGA,
    description: "Tipo de transacción: RECARGA o COMPRA"
  })
  tipo: TipoTransaccion

  @ApiProperty({ example: 50000, description: "Monto de la transacción", type: "string" })
  monto: Prisma.Decimal

  @ApiProperty({
    example: "Recarga inicial",
    description: "Descripción de la transacción",
    nullable: true
  })
  descripcion: string | null

  @ApiProperty({
    example: "2025-11-05T22:25:26.000Z",
    description: "Fecha de creación de la transacción"
  })
  createdAt: Date
}
