import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

import type {
  ConfirmarPagoResponseEntity as ConfirmarPagoResponseType,
  PagoIniciadoEntity as PagoIniciadoType,
  RecargaResponseEntity as RecargaResponseType,
  SaldoResponseEntity as SaldoResponseType,
} from '../../api-db';
import { ConfirmarPagoDto, PagarDto, RecargaBilleteraDto } from '../dto';
import {
  ConfirmarPagoResponseEntity,
  PagoIniciadoResponseEntity,
  RecargaResponseEntity,
  SaldoResponseEntity,
} from '../entities';
import { BilleteraProxyService } from '../services/billetera-proxy.service';

@ApiTags('Billetera')
@ApiSecurity('api-key')
@Controller('billetera')
export class BilleteraController {
  constructor(private readonly billeteraProxyService: BilleteraProxyService) {}

  @Post('recarga')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Recargar saldo a la billetera',
    description:
      'Carga dinero a la billetera de un cliente. Requiere documento, celular y monto mayor a 0.',
  })
  @ApiOkResponse({ type: RecargaResponseEntity })
  async recargarBilletera(
    @Body() dto: RecargaBilleteraDto,
  ): Promise<RecargaResponseType> {
    return this.billeteraProxyService.recargarBilletera(dto);
  }

  @Post('pagar')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Iniciar proceso de pago',
    description:
      'Genera un token de 6 dígitos y lo envía al email del cliente. El token expira en 15 minutos y solo se puede usar una vez.',
  })
  @ApiOkResponse({ type: PagoIniciadoResponseEntity })
  async iniciarPago(@Body() dto: PagarDto): Promise<PagoIniciadoType> {
    return this.billeteraProxyService.iniciarPago(dto);
  }

  @Post('confirmar-pago')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Confirmar pago con token',
    description:
      'Confirma el pago usando el ID de sesión y el token recibido por email. Valida que no esté expirado ni usado, y descuenta el monto del saldo.',
  })
  @ApiOkResponse({ type: ConfirmarPagoResponseEntity })
  async confirmarPago(
    @Body() dto: ConfirmarPagoDto,
  ): Promise<ConfirmarPagoResponseType> {
    return this.billeteraProxyService.confirmarPago(dto);
  }

  @Get('saldo')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Consultar saldo de la billetera',
    description:
      'Consulta el saldo actual de un cliente e incluye estadísticas de transacciones (recargas y compras).',
  })
  @ApiOkResponse({ type: SaldoResponseEntity })
  @ApiQuery({
    name: 'documento',
    required: true,
    description: 'Número de documento del cliente',
    example: '1134854312',
  })
  @ApiQuery({
    name: 'celular',
    required: true,
    description: 'Número de celular del cliente',
    example: '3001234567',
  })
  async consultarSaldo(
    @Query('documento') documento: string,
    @Query('celular') celular: string,
  ): Promise<SaldoResponseType> {
    return this.billeteraProxyService.consultarSaldo(documento, celular);
  }
}
