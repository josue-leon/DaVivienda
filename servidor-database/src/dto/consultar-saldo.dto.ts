import { IsNotEmpty, IsString } from "class-validator"

import { ApiProperty } from "@nestjs/swagger"

export class ConsultarSaldoDto {
  @ApiProperty({
    description: "Número de documento de identidad del cliente",
    example: "12345678"
  })
  @IsString()
  @IsNotEmpty()
  documento: string

  @ApiProperty({
    description: "Número de teléfono celular del cliente",
    example: "3001234567"
  })
  @IsString()
  @IsNotEmpty()
  celular: string
}
