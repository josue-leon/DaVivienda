import { ValidationError } from "class-validator"

import { BadRequestException, ValidationPipe } from "@nestjs/common"

export function gValidationPipes() {
  return new ValidationPipe({
    whitelist: true,
    transform: true,
    stopAtFirstError: true,
    forbidNonWhitelisted: true,
    exceptionFactory: (validationErrors: ValidationError[] = []) => {
      return new BadRequestException(
        validationErrors.map(
          (error) =>
            ({
              field: error.property,
              error: error.constraints
            }) as IValidationErrors
        )
      )
    }
  })
}

export interface IValidationErrors {
  field: string
  error: object
}

/**
 * whitelist: Elimina campos no decorados en el DTO
 * forbidNonWhitelisted: Lanza excepción si hay propiedades no permitidas
 * stopAtFirstError: Detiene la validación después del primer error
 * transform: Convierte tipos primitivos automáticamente
 *
 * @see https://docs.nestjs.com/techniques/validation
 */
