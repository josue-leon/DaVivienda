import { HttpStatus } from "@nestjs/common"

import { EnumError500 } from "../enums/error-500.enum"
import { TError500 } from "../types/error.types"

// INTERNAL SERVER ERROR
export const Error500: TError500 = {
  [EnumError500.ErrorDesconocido]: {
    title: "SERVIDOR",
    message: "Se ha generado un error inesperado/desconocido",
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    tag: "ERROR_DESCONOCIDO"
  },

  [EnumError500.ErrorFueraDeCaptura]: {
    title: "SERVIDOR",
    message: "Se ha generado un error que no se ha logrado capturar",
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    tag: "ERROR_FUERA_CAPTURA"
  },

  [EnumError500.EmailNoInicializado]: {
    title: "SERVIDOR",
    message: "El servicio de email no está inicializado",
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    tag: "EMAIL_NO_INICIALIZADO"
  },

  [EnumError500.ErrorEnvioEmail]: {
    title: "SERVIDOR",
    message: "No se pudo enviar el email de confirmación",
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    tag: "ERROR_ENVIO_EMAIL"
  },

  // ERRORES GENÉRICOS
  [EnumError500.ErrorGenerico]: {
    title: "SERVIDOR",
    message: "Ha ocurrido un error genérico",
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    tag: "ERROR_GENERICO"
  },

  // ERRORES DE PRISMA
  [EnumError500.ErrorPrisma]: {
    title: "BASE DE DATOS",
    message: "Error en la operación de base de datos",
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    tag: "PRISMA_ERROR"
  },

  [EnumError500.ErrorPrismaUniqueConstraint]: {
    title: "BASE DE DATOS",
    message: "El registro ya existe en la base de datos",
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    tag: "PRISMA_UNIQUE_CONSTRAINT"
  },

  [EnumError500.ErrorPrismaForeignKeyConstraint]: {
    title: "BASE DE DATOS",
    message: "Error de relación entre registros",
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    tag: "PRISMA_FOREIGN_KEY"
  },

  [EnumError500.ErrorPrismaRecordNotFound]: {
    title: "BASE DE DATOS",
    message: "Registro no encontrado en la base de datos",
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    tag: "PRISMA_RECORD_NOT_FOUND"
  },

  [EnumError500.ErrorPrismaValidation]: {
    title: "BASE DE DATOS",
    message: "Error de validación en la consulta de base de datos",
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    tag: "PRISMA_VALIDATION"
  },

  [EnumError500.ErrorPrismaConnection]: {
    title: "BASE DE DATOS",
    message: "Error de conexión con la base de datos",
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    tag: "PRISMA_CONNECTION"
  },

  [EnumError500.ErrorPrismaTimeout]: {
    title: "BASE DE DATOS",
    message: "Tiempo de espera excedido en la base de datos",
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    tag: "PRISMA_TIMEOUT"
  }
}
