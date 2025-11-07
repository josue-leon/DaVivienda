import { envs } from "envs"
import { Observable } from "rxjs"

import { CanActivate, ExecutionContext, Injectable, Logger } from "@nestjs/common"

import { CustomError } from "~/globals/custom.errors"
import { EnumError401 } from "~/globals/errors"

/**
 * Guard que protege los endpoints validando la API Key
 */
@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly logger = new Logger(ApiKeyGuard.name)
  private readonly apiKey: string

  constructor() {
    this.apiKey = envs.API_KEY || ""

    if (!this.apiKey) {
      this.logger.warn(
        "API_KEY no está configurada en las variables de entorno. Esto es inseguro en producción."
      )
    }
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | string[] | undefined>
      ip?: string
    }>()
    const apiKeyHeader = request.headers["x-api-key"]

    if (!this.apiKey) {
      this.logger.warn("API Key no configurada, acceso permitido por defecto (INSEGURO)")
      return true
    }

    if (!apiKeyHeader) {
      this.logger.warn(`Intento de acceso sin API Key desde ${request.ip ?? "IP desconocida"}`)
      throw new CustomError(EnumError401.ApiKeyFaltante)
    }

    if (apiKeyHeader !== this.apiKey) {
      this.logger.warn(`API Key inválida desde ${request.ip ?? "IP desconocida"}`)
      throw new CustomError(EnumError401.ApiKeyInvalida)
    }

    return true
  }
}
