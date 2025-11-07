import { IsNotEmpty, IsString, IsUUID, Length, Matches } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class ConfirmarPagoDto {
  @ApiProperty({
    description: 'ID de la sesión de compra generado al iniciar el pago',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID('4')
  id_sesion: string;

  @ApiProperty({
    description: 'Token de confirmación de 6 dígitos enviado al email',
    example: '123456',
    minLength: 6,
    maxLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  @Matches(/^[0-9]{6}$/)
  token: string;
}
