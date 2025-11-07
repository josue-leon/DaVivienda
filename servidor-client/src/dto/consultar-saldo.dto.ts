import { IsNotEmpty, IsString, Length } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class ConsultarSaldoDto {
  @ApiProperty({
    description: 'Documento de identidad del cliente',
    example: '1234567890',
  })
  @IsString()
  @IsNotEmpty()
  @Length(5, 20)
  documento: string;

  @ApiProperty({
    description: 'Número de celular del cliente',
    example: '0999999999',
  })
  @IsString()
  @IsNotEmpty()
  @Length(10, 15)
  celular: string;
}
