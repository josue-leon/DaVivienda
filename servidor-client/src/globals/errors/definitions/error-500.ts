import { HttpStatus } from '@nestjs/common';

import { EnumError500 } from '../enums/error-500.enum';
import { TError500 } from '../types/error.types';

export const Error500: TError500 = {
  [EnumError500.ErrorConexionServidorDatabase]: {
    title: 'SERVIDOR',
    message: 'No se pudo conectar con el servidor de base de datos',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  [EnumError500.ErrorServidorDatabase]: {
    title: 'SERVIDOR',
    message: 'Error capturado desde el servidor de base de datos',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
};
