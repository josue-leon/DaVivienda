import { IsEmail, IsNumber, IsPositive, MaxLength, Min, MinLength } from "class-validator"

import { IsNotEmptyString, IsValidCelular } from "./custom-validator"

/**
 * Validadores reutilizables para campos de celular
 * Uso: @Sequentials(celularValidators)
 */
export const celularValidators = [
  IsNotEmptyString({ message: "El celular es requerido" }),
  MinLength(7, { message: "El celular debe tener al menos 7 caracteres" }),
  MaxLength(20, { message: "El celular no puede exceder 20 caracteres" }),
  IsValidCelular({
    message: "El celular solo puede contener números y los caracteres +, -, (, ), espacio"
  })
]

/**
 * Validadores reutilizables para campos de documento
 * Uso: @Sequentials(documentoValidators)
 */
export const documentoValidators = [
  IsNotEmptyString({ message: "El documento es requerido" }),
  MinLength(5, { message: "El documento debe tener al menos 5 caracteres" }),
  MaxLength(20, { message: "El documento no puede exceder 20 caracteres" })
]

/**
 * Validadores reutilizables para campos de nombres
 * Uso: @Sequentials(nombresValidators)
 */
export const nombresValidators = [
  IsNotEmptyString({ message: "Los nombres son requeridos" }),
  MinLength(3, { message: "Los nombres deben tener al menos 3 caracteres" }),
  MaxLength(200, { message: "Los nombres no pueden exceder 200 caracteres" })
]

/**
 * Validadores reutilizables para campos de email
 * Uso: @Sequentials(emailValidators)
 */
export const emailValidators = [
  IsNotEmptyString({ message: "El email es requerido" }),
  IsEmail({}, { message: "Debe proporcionar un email válido" }),
  MaxLength(200, { message: "El email no puede exceder 200 caracteres" })
]

/**
 * Validadores reutilizables para campos de monto
 * Uso: @Sequentials(montoValidators)
 */
export const montoValidators = [
  IsNumber({}, { message: "El monto debe ser un número" }),
  IsPositive({ message: "El monto debe ser positivo" }),
  Min(0.01, { message: "El monto mínimo es 0.01" })
]
