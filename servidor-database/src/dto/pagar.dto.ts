import { Type } from "class-transformer"
import { IsNotEmpty, IsNumber, IsString, Min, Matches } from "class-validator"

import { ApiProperty } from "@nestjs/swagger"
import { IsDocumentoColombia } from "../validators/documento-colombia.validator"

export class PagarDto {
  @ApiProperty({
    description: "Número de documento de identidad del cliente (cédula colombiana)",
    example: "1134854312"
  })
  @IsString()
  @IsNotEmpty()
  @IsDocumentoColombia()
  documento: string

  @ApiProperty({
    description: "Número de teléfono celular del cliente (10 dígitos)",
    example: "3001234567"
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{10}$/, { message: 'El celular debe tener exactamente 10 dígitos' })
  celular: string

  @ApiProperty({
    description: "Monto de la compra a realizar",
    example: 25000,
    minimum: 0.01
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  monto: number
}
