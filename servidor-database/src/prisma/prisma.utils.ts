import { hash } from "argon2"

/**
 * Utilidad para cifrar contraseñas usando Argon2
 *
 * NOTA: Este archivo está preparado para futuros casos de uso donde se requiera
 * autenticación de usuarios con contraseñas. Para el reto actual (billetera virtual)
 * no se necesita cifrado de contraseñas.
 */

export async function cifredKey(claveSinCifrar: string): Promise<string> {
  return await hash(claveSinCifrar)
}
