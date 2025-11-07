import { Module } from "@nestjs/common"
import { APP_GUARD } from "@nestjs/core"
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler"

import { ApiKeyGuard } from "./guards/api-key.guard"
import { BilleteraModule } from "./modules/billetera.module"
import { ClientesModule } from "./modules/clientes.module"
import { DatabaseModule } from "./modules/database.module"

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 100
        }
      ]
    }),

    DatabaseModule,
    ClientesModule,
    BilleteraModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class AppModule {}
