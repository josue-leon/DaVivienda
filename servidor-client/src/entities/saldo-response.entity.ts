import { ApiProperty } from '@nestjs/swagger';

class ClienteSaldoEntity {
  @ApiProperty({ example: '1234567890', description: 'Documento del cliente' })
  documento: string;

  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del cliente' })
  nombres: string;

  @ApiProperty({
    example: 'ju**@em***.com',
    description: 'Email del cliente (parcialmente oculto)',
  })
  email: string;
}

class EstadisticasEntity {
  @ApiProperty({
    example: '500000',
    description: 'Total de recargas realizadas',
  })
  totalRecargas: string;

  @ApiProperty({
    example: '200000',
    description: 'Total de compras realizadas',
  })
  totalCompras: string;

  @ApiProperty({ example: 10, description: 'Número de recargas' })
  numeroRecargas: number;

  @ApiProperty({ example: 5, description: 'Número de compras' })
  numeroCompras: number;
}

export class SaldoResponseEntity {
  @ApiProperty({ type: ClienteSaldoEntity, description: 'Datos del cliente' })
  cliente: ClienteSaldoEntity;

  @ApiProperty({
    example: '300000',
    description: 'Saldo actual de la billetera',
  })
  saldo: string;

  @ApiProperty({
    type: EstadisticasEntity,
    description: 'Estadísticas de transacciones',
  })
  estadisticas: EstadisticasEntity;

  @ApiProperty({
    example: '2025-11-06T22:30:00.000Z',
    description: 'Fecha de la consulta',
  })
  fechaConsulta: string;
}
