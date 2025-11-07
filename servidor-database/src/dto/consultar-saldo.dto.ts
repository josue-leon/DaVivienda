import { IsNotEmpty, IsString, Matches } from "class-validator"

import { ApiProperty } from "@nestjs/swagger"
import { IsDocumentoColombia } from "../validators/documento-colombia.validator"

export class ConsultarSaldoDto {
  @ApiProperty({
    description: "Número de documento de identidad del cliente (cédula colombiana)",
    example: "1234567890"
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
}
