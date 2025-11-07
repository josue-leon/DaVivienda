import { ApiProperty } from '@nestjs/swagger';

class ClienteConfirmacionEntity {
  @ApiProperty({ example: '1234567890', description: 'Documento del cliente' })
  documento: string;

  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del cliente' })
  nombres: string;
}

export class ConfirmarPagoResponseEntity {
  @ApiProperty({
    type: ClienteConfirmacionEntity,
    description: 'Datos del cliente',
  })
  cliente: ClienteConfirmacionEntity;

  @ApiProperty({
    example: '25000',
    description: 'Monto descontado de la billetera',
  })
  montoDescontado: string;

  @ApiProperty({
    example: '100000',
    description: 'Saldo anterior antes del pago',
  })
  saldoAnterior: string;

  @ApiProperty({
    example: '75000',
    description: 'Saldo nuevo después del pago',
  })
  saldoNuevo: string;

  @ApiProperty({
    example: '2025-11-06T22:30:00.000Z',
    description: 'Fecha y hora de la transacción',
  })
  fechaTransaccion: string;
}
