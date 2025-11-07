import { HttpStatus } from '@nestjs/common';

import { EnumError401 } from '../enums/error-401.enum';
import { TError401 } from '../types/error.types';

export const Error401: TError401 = {
  [EnumError401.NoAutorizado]: {
    title: 'AUTENTICACIÓN',
    message: 'No autorizado',
    statusCode: HttpStatus.UNAUTHORIZED,
  },
};
