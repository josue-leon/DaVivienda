import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { BilleteraController } from './controllers/billetera.controller';
import { ClienteController } from './controllers/cliente.controller';
import { GlobalExceptionFilter } from './globals/http-exception.filter';
import { ApiKeyGuard } from './guards/api-key.guard';
import { BilleteraProxyService } from './services/billetera-proxy.service';
import { ClienteProxyService } from './services/cliente-proxy.service';

@Module({
  imports: [
    // Rate limiting: 10 peticiones por minuto
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 segundos
        limit: 10, // 10 peticiones
      },
    ]),
  ],
  controllers: [ClienteController, BilleteraController],
  providers: [
    ClienteProxyService,
    BilleteraProxyService,
    // Filtro global de excepciones
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    // Guards globales
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
