import { ApiProperty } from '@nestjs/swagger';

export class PagoIniciadoResponseEntity {
  @ApiProperty({
    example: 'ses_abc123xyz456',
    description: 'ID de la sesión de pago generado',
  })
  id_sesion: string;
}
