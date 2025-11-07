import { Injectable, Logger } from '@nestjs/common';

import type {
  BilleteraApi,
  ConfirmarPagoDto,
  PagarDto,
  RecargaBilleteraDto,
} from '../../api-db';
import { BilleteraApi as BilleteraApiClass } from '../../api-db';
import { BaseDatabaseProxyService } from './base-database-proxy.service';

@Injectable()
export class BilleteraProxyService extends BaseDatabaseProxyService {
  protected readonly logger = new Logger(BilleteraProxyService.name);
  private readonly apiClient: BilleteraApi;

  constructor() {
    super();
    const config = this.createDatabaseApiConfig();
    this.apiClient = new BilleteraApiClass(config);
    this.logger.log('BilleteraProxyService inicializado');
  }

  async recargarBilletera(dto: RecargaBilleteraDto) {
    try {
      this.logger.log(
        `[PROXY] Recarga de billetera: ${dto.documento}, Monto: ${dto.monto}`,
      );

      const response =
        await this.apiClient.billeteraControllerRecargarBilletera(dto);

      this.logger.log(`[PROXY] ✅ Recarga exitosa: ${dto.documento}`);
      return response.data;
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(`[PROXY] ❌ Error en recarga: ${err.message}`);
      this.handleDatabaseApiError(error);
    }
  }

  async iniciarPago(dto: PagarDto) {
    try {
      this.logger.log(
        `[PROXY] Iniciando pago: ${dto.documento}, Monto: ${dto.monto}`,
      );

      const response = await this.apiClient.billeteraControllerIniciarPago(dto);

      this.logger.log(
        `[PROXY] ✅ Pago iniciado exitosamente: ${dto.documento}`,
      );
      return response.data;
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(`[PROXY] ❌ Error al iniciar pago: ${err.message}`);
      this.handleDatabaseApiError(error);
    }
  }

  async confirmarPago(dto: ConfirmarPagoDto) {
    try {
      this.logger.log(`[PROXY] Confirmando pago: Sesión ${dto.id_sesion}`);

      const response =
        await this.apiClient.billeteraControllerConfirmarPago(dto);

      this.logger.log(
        `[PROXY] ✅ Pago confirmado exitosamente: Sesión ${dto.id_sesion}`,
      );
      return response.data;
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(`[PROXY] ❌ Error al confirmar pago: ${err.message}`);
      this.handleDatabaseApiError(error);
    }
  }

  async consultarSaldo(documento: string, celular: string) {
    try {
      this.logger.log(`[PROXY] Consultando saldo: ${documento}`);

      const response = await this.apiClient.billeteraControllerConsultarSaldo(
        documento,
        celular,
      );

      this.logger.log(`[PROXY] ✅ Saldo consultado exitosamente: ${documento}`);
      return response.data;
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(`[PROXY] ❌ Error al consultar saldo: ${err.message}`);
      this.handleDatabaseApiError(error);
    }
  }
}
