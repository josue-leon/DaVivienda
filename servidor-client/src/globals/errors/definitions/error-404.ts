import { HttpStatus } from '@nestjs/common';

import { EnumError404 } from '../enums/error-404.enum';
import { TError404 } from '../types/error.types';

export const Error404: TError404 = {
  [EnumError404.NoEncontrado]: {
    title: 'RECURSO',
    message: 'No encontrado',
    statusCode: HttpStatus.NOT_FOUND,
  },
};
