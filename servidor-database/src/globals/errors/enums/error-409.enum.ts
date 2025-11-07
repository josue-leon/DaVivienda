/**
 * HTTP 409 - Conflict
 *
 * Indica que la solicitud no se puede completar debido a un conflicto con el
 * estado actual del recurso en el servidor.
 *
 * Uso:
 * - Duplicados (registros que ya existen)
 * - Violaciones de constraints únicos en BD
 * - Conflictos de concurrencia o estado
 *
 * Casos comunes:
 * - Email ya registrado
 * - Documento/username ya en uso
 * - Actualización con versión desactualizada (optimistic locking)
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/409
 */
export enum EnumError409 {
  YaExiste = 409_000,
  DocumentoYaRegistrado = 409_001,
  EmailYaRegistrado = 409_002
}
