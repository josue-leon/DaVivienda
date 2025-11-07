/**
 * HTTP 403 - Forbidden
 *
 * Indica que el cliente no tiene permisos de acceso al recurso solicitado,
 * aunque el servidor entendió la solicitud y el cliente está autenticado.
 *
 * Uso:
 * - Usuario autenticado pero sin permisos necesarios
 * - Intento de acceso a recursos restringidos
 * - Operaciones no permitidas por rol o nivel de acceso
 *
 * Diferencia con 401: En 403 el cliente está autenticado, pero no autorizado.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403
 */
export enum EnumError403 {
  AccesoDenegado = 403_000
}
