import { BilleteraApi, type RecargaBilleteraDto, type RecargaResponseEntity, type PagoIniciadoResponseEntity, type PagarDto, type ConfirmarPagoDto, type ConfirmarPagoResponseEntity, type SaldoResponseEntity } from '../../api-client';
import type { ConsultarSaldoParams } from '../types/api.types';
import { configurationBase } from './base-api';

const billeteraApi = new BilleteraApi(configurationBase);

export const billeteraService = {
  /**
   * Recarga saldo a la billetera de un cliente
   */
  async recargar(data: RecargaBilleteraDto): Promise<RecargaResponseEntity> {
    const response = await billeteraApi.billeteraControllerRecargarBilletera(data);
    return response.data;
  },

  /**
   * Inicia el proceso de pago - genera token y lo envía al email
   */
  async iniciarPago(data: PagarDto): Promise<PagoIniciadoResponseEntity> {
    const response = await billeteraApi.billeteraControllerIniciarPago(data);
    return response.data;
  },

  /**
   * Confirma el pago con el token recibido por email
   */
  async confirmarPago(data: ConfirmarPagoDto): Promise<ConfirmarPagoResponseEntity> {
    const response = await billeteraApi.billeteraControllerConfirmarPago(data);
    return response.data;
  },

  /**
   * Consulta el saldo y estadísticas de un cliente
   */
  async consultarSaldo(params: ConsultarSaldoParams): Promise<SaldoResponseEntity> {
    const response = await billeteraApi.billeteraControllerConsultarSaldo(params.documento, params.celular);
    return response.data;
  },
};
