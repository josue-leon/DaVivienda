import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';
import { envs } from 'envs';

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const isDevelopment = envs.NODE_ENV === 'dev';

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false }),
  );

  // CORS
  await app.register(fastifyCors, {
    origin: [
      `http://127.0.0.1:${envs.PORT}`,
      `http://localhost:${envs.PORT}`,
      `http://127.0.0.1:3000`,
      `http://localhost:3000`,
      `http://localhost:5173`,
    ],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
    credentials: true,
  });

  // Seguridad Helmet
  await app.register(fastifyHelmet, { global: true });

  // Configuración global
  app.setGlobalPrefix(envs.API_PREFIX);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  if (isDevelopment) {
    const config = new DocumentBuilder()
      .setTitle(envs.PROJECT)
      .setDescription(
        'API REST que actúa como puente entre el cliente web y el servidor-database',
      )
      .setVersion('1.0')
      .addServer(`${envs.PROTOCOLO}://${envs.IP_SERVER}:${envs.PORT}`)
      .build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(envs.DOC_SWAGGER, app, documentFactory, {
      jsonDocumentUrl: envs.URL_JSON_SWAGGER,
    });
  }

  await app.listen(envs.PORT, envs.LISTEN_SERVER);

  if (isDevelopment) {
    Logger.log(
      `Servidor: ${envs.PROTOCOLO}://${envs.IP_SERVER}:${envs.PORT}/${envs.API_PREFIX}`,
    );
    Logger.log(
      `Docs-Json: ${envs.PROTOCOLO}://${envs.IP_SERVER}:${envs.PORT}/${envs.URL_JSON_SWAGGER}`,
    );
    Logger.log(
      `Docs: ${envs.PROTOCOLO}://${envs.IP_SERVER}:${envs.PORT}/${envs.DOC_SWAGGER}`,
    );
    Logger.log(`Conectado a: ${envs.DATABASE_SERVER_URL}`);
  }
}

bootstrap().catch(handleError);

function handleError(error: unknown) {
  console.error(error);
  process.exit(1);
}

process.on('uncaughtException', handleError);
