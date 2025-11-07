import { HttpStatus } from "@nestjs/common"

import { EnumError401 } from "../enums/error-401.enum"
import { TError401 } from "../types/error.types"

// UNAUTHORIZED
export const Error401: TError401 = {
  [EnumError401.NoAutorizado]: {
    title: "AUTENTICACIÓN",
    message: "No autorizado",
    statusCode: HttpStatus.UNAUTHORIZED
  },

  [EnumError401.ApiKeyFaltante]: {
    title: "AUTENTICACIÓN",
    message: "API Key requerida. Incluye el header 'x-api-key'",
    statusCode: HttpStatus.UNAUTHORIZED
  },

  [EnumError401.ApiKeyInvalida]: {
    title: "AUTENTICACIÓN",
    message: "API Key inválida",
    statusCode: HttpStatus.UNAUTHORIZED
  }
}
