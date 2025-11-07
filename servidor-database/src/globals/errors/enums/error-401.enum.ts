/**
 * HTTP 401 - Unauthorized
 *
 * Indica que la solicitud requiere autenticación del usuario. El cliente debe
 * autenticarse para obtener la respuesta solicitada.
 *
 * Uso:
 * - Falta de credenciales de autenticación
 * - Credenciales inválidas o expiradas
 * - Token de autenticación no proporcionado
 *
 * Nota: A menudo se confunde con 403 (Forbidden). Usar 401 cuando faltan credenciales
 * y 403 cuando las credenciales son válidas pero sin permisos suficientes.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401
 */
export enum EnumError401 {
  NoAutorizado = 401_000,
  ApiKeyFaltante = 401_001,
  ApiKeyInvalida = 401_002
}
