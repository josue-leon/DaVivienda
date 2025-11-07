import {
  ValidateIf,
  ValidationArguments,
  type ValidationOptions,
  isNotEmpty,
  isString,
  registerDecorator,
  validateSync
} from "class-validator"

import { EnumNameValidations } from "./enums-validators"

/**
 * @param condition
 * @true Omite las demas validaciones hijas
 * @false Continua procesando las demas validaciones hijas
 */
export function IsOptionalIfOmitAll(
  condition: (object: any, value: any) => boolean,
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return ValidateIf((object: Record<string, unknown>, value: string): boolean => {
    return !condition(object, value)
  }, validationOptions)
}

/**
 * @IsOptionalIfUndefinedOmitAll
 * Si el valor es:
 * + undefined: omite las validaciones hijas (permite el paso de undefined)
 * + null: no omite, procesa las validaciones hijas (no permite el paso de null)
 *
 * @IsOptional
 * Si el valor es:
 * + undefined: omite las validaciones hijas (permite el paso de undefined)
 * + null: omite las validaciones hijas (permite el paso de null)
 * Lo que puede generar error al crear algo en la db si el campo a guardar no puede ser null
 */

/**
 * @param condition
 * @true Omite las demas validaciones hijas solo si es undefined
 * @false Continua procesando las demas validaciones hijas si no es undefined
 */
export function IsOptionalIfUndefinedOmitAll() {
  return IsOptionalIfOmitAll((object, value) => {
    // # Si es undefined es decir si no se envia por la api ese {key: value} entonces omite el resto de validaciones hijas
    if (value === undefined) {
      return true
    }

    // # Caso contrario. No omitir y continuar con las demas validaciones hijas
    return false
  })
}

export function IsNotEmptyString(validationOptions?: ValidationOptions): PropertyDecorator {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: EnumNameValidations.isNotEmptyString,
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: (value: any): boolean => isString(value) && isNotEmpty(value.trim()),
        defaultMessage: (args: ValidationArguments): string =>
          `${args.property} should not be an empty string`
      }
    })
  }
}

export function Sequentials(
  validators: ((object: object, propertyName: string) => void)[],
  validationOptions?: ValidationOptions
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: EnumNameValidations.sequentials,
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          for (const ValidatorClass of validators) {
            // Crear instancia vacía
            const TempClass = class {}
            const tempInstance = new TempClass()

            // Definir la propiedad manualmente
            Object.defineProperty(tempInstance, propertyName, {
              value,
              configurable: true,
              enumerable: true,
              writable: true
            })

            // Aplica el decorador de validación
            ValidatorClass(tempInstance, propertyName)

            // Ejecuta la validación
            const errors = validateSync(tempInstance)
            if (errors.length > 0) return false // Detiene en el primer error
          }
          return true
        },
        defaultMessage(args: ValidationArguments) {
          for (const ValidatorClass of validators) {
            // Crear instancia vacía
            const TempClass = class {}
            const tempInstance = new TempClass()

            // Definir la propiedad manualmente
            Object.defineProperty(tempInstance, args.property, {
              value: args.value,
              configurable: true,
              enumerable: true,
              writable: true
            })

            ValidatorClass(tempInstance, args.property)
            const errors = validateSync(tempInstance)

            if (errors.length > 0) {
              return Object.values(errors[0].constraints || {})[0] // Retorna el primer error
            }
          }
          return "Valor inválido"
        }
      }
    })
  }
}

export function SequentialsFns(
  validationFns: ((value: any) => string | null)[],
  validationOptions?: ValidationOptions
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: EnumNameValidations.sequentialsFns,
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          for (const validateFn of validationFns) {
            const errorMessage = validateFn(value)
            if (errorMessage) {
              return false // Detiene la validación si encuentra un error
            }
          }
          return true
        },
        defaultMessage(args: ValidationArguments) {
          for (const validateFn of validationFns) {
            const errorMessage = validateFn(args.value)
            if (errorMessage) {
              return errorMessage // Devuelve el primer error encontrado
            }
          }
          return "Valor inválido"
        }
      }
    })
  }
}

/**
 * Validator para números de celular
 * - Valida que sea string y no vacío
 * - Valida formato numérico con caracteres permitidos: +, -, (, ), espacio
 */
export function IsValidCelular(validationOptions?: ValidationOptions): PropertyDecorator {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: EnumNameValidations.isValidCelular,
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: (value: any): boolean => {
          if (typeof value !== "string") return false
          const trimmed = value.trim()
          if (trimmed.length === 0) return false
          // Valida que contenga al menos un número y solo caracteres permitidos
          const hasNumber = /\d/.test(trimmed)
          const validChars = /^[0-9+\-\s()]+$/.test(trimmed)
          return hasNumber && validChars
        },
        defaultMessage: (args: ValidationArguments): string =>
          `${args.property} debe ser un número de celular válido (solo números y los caracteres +, -, (, ), espacio)`
      }
    })
  }
}
