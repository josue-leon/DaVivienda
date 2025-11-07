import { HttpException } from '@nestjs/common';

import {
  EnumError500,
  Error400,
  Error401,
  Error403,
  Error404,
  Error409,
  Error500,
  TypeEnumError,
} from './errors';
import { ErrorCustomEntity } from './http-exception.filter';

/**
 * Definición de todos los errores personalizados de la aplicación
 * agrupados por tipo de estado HTTP para mejor organización
 */
const errorDetails: Record<TypeEnumError, ErrorCustomEntity> = {
  ...Error400,
  ...Error401,
  ...Error403,
  ...Error404,
  ...Error409,
  ...Error500,
};

/**
 * Obtiene los detalles de un error específico
 */
function getErrorDetails(errorType: TypeEnumError): ErrorCustomEntity {
  return errorDetails[errorType];
}

/**
 * Clase para manejar errores personalizados en la aplicación
 */
export class CustomError extends HttpException {
  code: number;
  base: ErrorCustomEntity;

  /**
   * Constructor de CustomError
   * @param errorType Tipo de error a manejar
   */
  constructor(errorType?: TypeEnumError) {
    const baseError = getErrorDetails(
      errorType ?? EnumError500.ErrorServidorDatabase,
    );

    super(baseError.message, baseError.statusCode);

    this.name = 'CustomError';
    this.code = errorType ?? EnumError500.ErrorServidorDatabase;
    this.base = baseError;

    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
