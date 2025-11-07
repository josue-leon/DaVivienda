/**
 * Genera un token numérico de 6 dígitos
 * Utilizado para confirmación de pagos
 */
export function generarTokenNumerico(): string {
  // Genera un número aleatorio entre 100000 y 999999
  const token = Math.floor(100000 + Math.random() * 900000)
  return token.toString()
}

/**
 * Calcula la fecha de expiración del token
 * @param minutosExpiracion - Cantidad de minutos hasta la expiración (por defecto 15)
 * @returns Fecha de expiración
 */
export function calcularExpiracion(minutosExpiracion: number = 15): Date {
  const ahora = new Date()
  ahora.setMinutes(ahora.getMinutes() + minutosExpiracion)
  return ahora
}

/**
 * Verifica si una fecha ya ha expirado
 * @param fechaExpiracion - Fecha a verificar
 * @returns true si ya expiró, false si aún es válida
 */
export function estaExpirado(fechaExpiracion: Date): boolean {
  const ahora = new Date()
  return ahora > fechaExpiracion
}

/**
 * Formatea un monto para mostrar en moneda
 * @param monto - Monto a formatear
 * @param moneda - Código de moneda (por defecto COP - Peso Colombiano)
 * @returns Monto formateado
 */
export function formatearMoneda(monto: number | string, moneda: string = "COP"): string {
  const numero = typeof monto === "string" ? parseFloat(monto) : monto

  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: moneda,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numero)
}

/**
 * Formatea una fecha en formato legible
 * @param fecha - Fecha a formatear
 * @returns Fecha formateada
 */
export function formatearFecha(fecha: Date): string {
  return new Intl.DateTimeFormat("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(fecha)
}
