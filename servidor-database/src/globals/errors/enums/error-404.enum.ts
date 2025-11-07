/**
 * HTTP 404 - Not Found
 *
 * Indica que el servidor no puede encontrar el recurso solicitado. Este código
 * es probablemente el más famoso debido a su frecuencia en la web.
 *
 * Uso:
 * - Recurso no existe en la base de datos
 * - ID o identificador no encontrado
 * - Endpoint no existe
 *
 * Nota: Usar 404 para recursos inexistentes, no para validaciones de negocio.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
 */
export enum EnumError404 {
  NoEncontrado = 404_000,
  ClienteNoEncontrado = 404_001,
  SesionNoEncontrada = 404_002
}
