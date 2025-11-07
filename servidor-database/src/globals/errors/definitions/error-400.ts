import { HttpStatus } from "@nestjs/common"

import { EnumError400 } from "../enums/error-400.enum"
import { TError400 } from "../types/error.types"

// BAD REQUEST
export const Error400: TError400 = {
  // ERRORES DE SOLICITUD
  [EnumError400.SolicitudIncorrecta]: {
    title: "SOLICITUD",
    message: "Error de solicitud incorrecta o mal formateada",
    statusCode: HttpStatus.BAD_REQUEST
  },
  [EnumError400.ValorNoDefinido]: {
    title: "VALIDACIÓN",
    message: "El valor proporcionado no está definido",
    statusCode: HttpStatus.BAD_REQUEST
  },

  // ERRORES DE BILLETERA
  [EnumError400.SaldoInsuficiente]: {
    title: "TRANSACCIÓN",
    message: "Saldo insuficiente para realizar la compra",
    statusCode: HttpStatus.BAD_REQUEST
  },
  [EnumError400.MontoInvalido]: {
    title: "TRANSACCIÓN",
    message: "El monto debe ser mayor a 0",
    statusCode: HttpStatus.BAD_REQUEST
  },

  // ERRORES DE SESIÓN Y TOKEN
  [EnumError400.SesionExpirada]: {
    title: "AUTENTICACIÓN",
    message: "El token de confirmación ha expirado",
    statusCode: HttpStatus.BAD_REQUEST
  },
  [EnumError400.SesionYaUsada]: {
    title: "AUTENTICACIÓN",
    message: "El token de confirmación ya fue utilizado",
    statusCode: HttpStatus.BAD_REQUEST
  },
  [EnumError400.TokenInvalido]: {
    title: "AUTENTICACIÓN",
    message: "El token de confirmación es inválido",
    statusCode: HttpStatus.BAD_REQUEST
  },

  // ERRORES DE CLIENTE
  [EnumError400.ClienteDocumentoCelularNoCoinciden]: {
    title: "VALIDACIÓN",
    message: "Documento y celular no coinciden con ningún cliente",
    statusCode: HttpStatus.BAD_REQUEST
  }
}
