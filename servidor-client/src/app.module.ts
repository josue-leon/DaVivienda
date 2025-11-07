import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 segundos
        limit: 10, // 10 peticiones
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
