import { HttpStatus } from "@nestjs/common"

import { EnumError409 } from "../enums/error-409.enum"
import { TError409 } from "../types/error.types"

// CONFLICT
export const Error409: TError409 = {
  [EnumError409.YaExiste]: {
    title: "DUPLICADO",
    message: "El campo ya existe",
    statusCode: HttpStatus.CONFLICT
  },

  // ERRORES DE CLIENTE
  [EnumError409.DocumentoYaRegistrado]: {
    title: "DUPLICADO",
    message: "El documento ya está registrado",
    statusCode: HttpStatus.CONFLICT
  },
  [EnumError409.EmailYaRegistrado]: {
    title: "DUPLICADO",
    message: "El email ya está registrado",
    statusCode: HttpStatus.CONFLICT
  }
}
