import { HttpStatus } from "@nestjs/common"

import { EnumError403 } from "../enums/error-403.enum"
import { TError403 } from "../types/error.types"

// FORBIDDEN
export const Error403: TError403 = {
  [EnumError403.AccesoDenegado]: {
    title: "PERMISOS",
    message: "No permitido",
    statusCode: HttpStatus.FORBIDDEN
  }
}
