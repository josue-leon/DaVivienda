import { HttpStatus } from "@nestjs/common"

import { EnumError404 } from "../enums/error-404.enum"
import { TError404 } from "../types/error.types"

// NOT FOUND
export const Error404: TError404 = {
  [EnumError404.NoEncontrado]: {
    title: "RECURSO",
    message: "No encontrado",
    statusCode: HttpStatus.NOT_FOUND
  },

  // ERRORES DE CLIENTE
  [EnumError404.ClienteNoEncontrado]: {
    title: "RECURSO",
    message: "Cliente no encontrado",
    statusCode: HttpStatus.NOT_FOUND
  },

  // ERRORES DE SESIÓN
  [EnumError404.SesionNoEncontrada]: {
    title: "RECURSO",
    message: "Sesión de compra no encontrada",
    statusCode: HttpStatus.NOT_FOUND
  }
}
