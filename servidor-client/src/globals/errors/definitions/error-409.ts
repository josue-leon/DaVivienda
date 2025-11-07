import { HttpStatus } from '@nestjs/common';

import { EnumError409 } from '../enums/error-409.enum';
import { TError409 } from '../types/error.types';

export const Error409: TError409 = {
  [EnumError409.YaExiste]: {
    title: 'DUPLICADO',
    message: 'El campo ya existe',
    statusCode: HttpStatus.CONFLICT,
  },
};
