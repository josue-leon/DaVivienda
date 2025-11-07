import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class PagarDto {
  @ApiProperty({
    description: 'Número de documento de identidad del cliente',
    example: '12345678',
  })
  @IsString()
  @IsNotEmpty()
  documento: string;

  @ApiProperty({
    description: 'Número de teléfono celular del cliente',
    example: '3001234567',
  })
  @IsString()
  @IsNotEmpty()
  celular: string;

  @ApiProperty({
    description: 'Monto de la compra a realizar',
    example: 25000,
    minimum: 0.01,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  monto: number;
}
