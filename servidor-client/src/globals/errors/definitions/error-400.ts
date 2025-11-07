import { HttpStatus } from '@nestjs/common';

import { EnumError400 } from '../enums/error-400.enum';
import { TError400 } from '../types/error.types';

export const Error400: TError400 = {
  [EnumError400.SolicitudIncorrecta]: {
    title: 'SOLICITUD',
    message: 'Error de solicitud incorrecta',
    statusCode: HttpStatus.BAD_REQUEST,
  },
};
