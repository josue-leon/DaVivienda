/**
 * HTTP 500 - Internal Server Error
 *
 * Indica que el servidor encontró una situación inesperada que le impidió
 * completar la solicitud. Es un error genérico del servidor.
 *
 * Uso:
 * - Excepciones no controladas
 * - Errores de conexión a base de datos
 * - Fallos en servicios externos
 * - Cualquier error inesperado del servidor
 *
 * Importante: Siempre loggear el error real para debugging. No exponer
 * detalles técnicos al cliente por seguridad.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500
 */
export enum EnumError500 {
  ErrorDesconocido = 500_000,
  ErrorFueraDeCaptura = 500_001,
  EmailNoInicializado = 500_002,
  ErrorEnvioEmail = 500_003,

  // Errores genéricos (throw new Error)
  ErrorGenerico = 500_004,

  // Errores de Prisma - Genérico
  ErrorPrisma = 500_900,

  // Errores específicos de Prisma por código
  ErrorPrismaUniqueConstraint = 500_901, // P2002
  ErrorPrismaForeignKeyConstraint = 500_902, // P2003
  ErrorPrismaRecordNotFound = 500_903, // P2025
  ErrorPrismaValidation = 500_904, // Validation errors
  ErrorPrismaConnection = 500_905, // Connection errors
  ErrorPrismaTimeout = 500_906 // Timeout errors
}
