import { Body, Controller, Get, HttpCode, HttpStatus, Post } from "@nestjs/common"
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags
} from "@nestjs/swagger"

import { RegistroClienteDto } from "../dto/registro-cliente.dto"
import { ClienteEntity } from "../entities/cliente.entity"
import { ClienteService } from "../services/cliente.service"

@ApiTags("Clientes")
@ApiSecurity("api-key")
@Controller("clientes")
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Post("registro")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Registrar un nuevo cliente",
    description:
      "Registra un nuevo cliente en la billetera virtual. " +
      "El documento y email deben ser únicos. Saldo inicial: 0."
  })
  @ApiCreatedResponse({ type: ClienteEntity })
  async registrarCliente(@Body() dto: RegistroClienteDto): Promise<ClienteEntity> {
    return this.clienteService.registrarCliente(dto)
  }

  @Get()
  @ApiOperation({
    summary: "Obtener todos los clientes registrados",
    description: "Obtener todos los clientes registrados en el sistema."
  })
  @ApiOkResponse({ type: [ClienteEntity] })
  async obtenerClientes(): Promise<ClienteEntity[]> {
    return this.clienteService.obtenerClientes()
  }
}
