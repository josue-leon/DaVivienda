import { HttpException, Logger } from '@nestjs/common';

import { Configuration as ConfigurationClass } from '../../api-db';
import { envs } from '../../envs';
import { CustomError } from '../globals/custom.errors';
import { EnumError500 } from '../globals/errors';

/**
 * Clase base para servicios proxy que se comunican con el servidor-database
 */
export abstract class BaseDatabaseProxyService {
  protected abstract readonly logger: Logger;

  /**
   * Crea la configuración para el cliente API del servidor-database
   */
  protected createDatabaseApiConfig(): ConfigurationClass {
    return new ConfigurationClass({
      basePath: envs.DATABASE_SERVER_URL,
      apiKey: envs.DATABASE_SERVER_API_KEY,
      baseOptions: {
        headers: {
          'x-api-key': envs.DATABASE_SERVER_API_KEY,
        },
      },
    });
  }

  /**
   * Maneja errores de llamadas HTTP al servidor-database
   */
  protected handleDatabaseApiError(error: unknown): never {
    // Si hay respuesta del servidor-database, propagar el error tal cual
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response: { status: number; data: unknown };
      };
      const status = axiosError.response.status;
      const data = axiosError.response.data;

      this.logger.error(
        `[PROXY] Error del servidor-database: ${String(status)}`,
        data,
      );
      throw new HttpException(
        data || 'Error en el servidor de base de datos',
        status,
      );
    }

    // Si no hay respuesta (error de conexión), usar CustomError
    if (error && typeof error === 'object' && 'request' in error) {
      this.logger.error('[PROXY] No se pudo conectar con el servidor-database');
      throw new CustomError(EnumError500.ErrorConexionServidorDatabase);
    }

    // Cualquier otro error
    throw new CustomError(EnumError500.ErrorServidorDatabase);
  }
}
