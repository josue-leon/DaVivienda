import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength, Matches } from "class-validator"

import { ApiProperty } from "@nestjs/swagger"
import { IsDocumentoColombia } from "../validators/documento-colombia.validator"

export class RegistroClienteDto {
  @ApiProperty({
    description: "Número de documento de identidad del cliente (cédula colombiana)",
    example: "1234567890"
  })
  @IsString()
  @IsNotEmpty()
  @IsDocumentoColombia()
  documento: string

  @ApiProperty({
    description: "Nombres completos del cliente",
    example: "Juan Pérez"
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  nombres: string

  @ApiProperty({
    description: "Email del cliente",
    example: "juan@email.com"
  })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({
    description: "Número de teléfono celular del cliente (10 dígitos)",
    example: "3001234567"
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{10}$/, { message: 'El celular debe tener exactamente 10 dígitos' })
  celular: string
}
