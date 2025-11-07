import { Injectable, Logger } from '@nestjs/common';

import type { ClientesApi, RegistroClienteDto } from '../../api-db';
import { ClientesApi as ClientesApiClass } from '../../api-db';
import { BaseDatabaseProxyService } from './base-database-proxy.service';

@Injectable()
export class ClienteProxyService extends BaseDatabaseProxyService {
  protected readonly logger = new Logger(ClienteProxyService.name);
  private readonly apiClient: ClientesApi;

  constructor() {
    super();
    const config = this.createDatabaseApiConfig();
    this.apiClient = new ClientesApiClass(config);
    this.logger.log('ClienteProxyService inicializado');
  }

  async registrarCliente(dto: RegistroClienteDto) {
    try {
      this.logger.log(`[PROXY] Registrando cliente: ${dto.documento}`);

      const response =
        await this.apiClient.clienteControllerRegistrarCliente(dto);

      this.logger.log(
        `[PROXY] ✅ Cliente registrado exitosamente: ${dto.documento}`,
      );
      return response.data;
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(
        `[PROXY] ❌ Error al registrar cliente: ${err.message}`,
      );
      this.handleDatabaseApiError(error);
    }
  }

  async obtenerClientes() {
    try {
      this.logger.log(`[PROXY] Obteniendo todos los clientes`);

      const response = await this.apiClient.clienteControllerObtenerClientes();
      return response.data;
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(
        `[PROXY] ❌ Error al obtener todos los clientes: ${err.message}`,
      );
      this.handleDatabaseApiError(error);
    }
  }
}
