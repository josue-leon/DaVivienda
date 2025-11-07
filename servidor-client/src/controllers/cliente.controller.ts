import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

import type { ClienteEntity } from '../../api-db';
import { RegistroClienteDto } from '../dto';
import { ClienteResponseEntity } from '../entities';
import { ClienteProxyService } from '../services/cliente-proxy.service';

@ApiTags('Clientes')
@ApiSecurity('api-key')
@Controller('clientes')
export class ClienteController {
  constructor(private readonly clienteProxyService: ClienteProxyService) {}

  @Post('registro')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registrar un nuevo cliente',
    description:
      'Registra un nuevo cliente en la billetera virtual mediante el servidor-database. ' +
      'El documento y email deben ser únicos. Saldo inicial: 0.',
  })
  @ApiCreatedResponse({ type: ClienteResponseEntity })
  async registrarCliente(
    @Body() dto: RegistroClienteDto,
  ): Promise<ClienteEntity> {
    return this.clienteProxyService.registrarCliente(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los clientes registrados',
    description: 'Obtener todos los clientes registrados en el sistema.',
  })
  @ApiOkResponse({ type: [ClienteResponseEntity] })
  async obtenerClientes(): Promise<ClienteResponseEntity[]> {
    return this.clienteProxyService.obtenerClientes();
  }
}
