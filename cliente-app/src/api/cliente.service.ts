import { ClientesApi, type ClienteResponseEntity, type RegistroClienteDto } from '../../api-client';
import { configurationBase } from './base-api';

const clientesApi = new ClientesApi(configurationBase);

export const clienteService = {
  /**
   * Registra un nuevo cliente en la billetera virtual
   */
  async registrar(data: RegistroClienteDto): Promise<ClienteResponseEntity> {
    const response = await clientesApi.clienteControllerRegistrarCliente(data);
    return response.data;
  },

  /**
   * Obtiene todos los clientes registrados
   */
  async clientes(): Promise<ClienteResponseEntity[]> {
    const response = await clientesApi.clienteControllerObtenerClientes();
    return response.data;
  },
};
