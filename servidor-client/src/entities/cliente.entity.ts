import { ApiProperty } from '@nestjs/swagger';

export class ClienteResponseEntity {
  @ApiProperty({ example: 1, description: 'ID único del cliente' })
  id: number;

  @ApiProperty({
    example: '1234567890',
    description: 'Documento de identidad del cliente',
  })
  documento: string;

  @ApiProperty({
    example: 'Juan Pérez García',
    description: 'Nombre completo del cliente',
  })
  nombres: string;

  @ApiProperty({
    example: 'juan.perez@example.com',
    description: 'Email del cliente',
  })
  email: string;

  @ApiProperty({
    example: '3001234567',
    description: 'Número de celular del cliente',
  })
  celular: string;

  @ApiProperty({ example: '0', description: 'Saldo actual de la billetera' })
  saldo: string;

  @ApiProperty({
    example: '2025-11-06T22:25:26.000Z',
    description: 'Fecha de creación',
  })
  createdAt: string;

  @ApiProperty({
    example: '2025-11-06T22:25:26.000Z',
    description: 'Fecha de última actualización',
  })
  updatedAt: string;
}
