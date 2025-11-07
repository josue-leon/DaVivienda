/**
 * HTTP 400 - Bad Request
 *
 * Indica que el servidor no puede procesar la solicitud debido a un error del cliente,
 * como sintaxis incorrecta, parámetros inválidos o validaciones de negocio fallidas.
 *
 * Uso:
 * - Datos de entrada malformados o inválidos
 * - Parámetros faltantes o incorrectos
 * - Validaciones de negocio que fallan (saldo insuficiente, tokens expirados, etc.)
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400
 */
export enum EnumError400 {
  SolicitudIncorrecta = 400_000,
  SaldoInsuficiente = 400_001,
  SesionExpirada = 400_002,
  SesionYaUsada = 400_003,
  TokenInvalido = 400_004,
  MontoInvalido = 400_005,
  ClienteDocumentoCelularNoCoinciden = 400_006,
  ValorNoDefinido = 400_007
}
