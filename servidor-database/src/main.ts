import fastifyCookie from "@fastify/cookie"
import fastifyCors from "@fastify/cors"
import fastifyHelmet from "@fastify/helmet"
import { envs } from "envs"

import { Logger } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"

import { AppModule } from "./app.module"
import { GlobalExceptionFilter } from "./globals/http-exception.filter"
import { gValidationPipes } from "./globals/validator.pipes"

async function bootstrap() {
  const isDevelopment = envs.NODE_ENV === "dev"

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false })
  )

  // Se pasan ciertos parametros por el header para simular que es un servidor express
  /* eslint-disable
    @typescript-eslint/no-unsafe-member-access,
    @typescript-eslint/no-unsafe-call,
    @typescript-eslint/no-unsafe-assignment,
    @typescript-eslint/no-unsafe-return
  */
  app
    .getHttpAdapter()
    .getInstance()
    .addHook("onRequest", (req: any, res: any, done: any) => {
      res.setHeader = (key: string, value: string) => res.raw.setHeader(key, value)
      res.end = (data?: any) => res.raw.end(data)
      req.res = res
      done()
    })
  /* eslint-enable
    @typescript-eslint/no-unsafe-member-access,
    @typescript-eslint/no-unsafe-call,
    @typescript-eslint/no-unsafe-assignment,
    @typescript-eslint/no-unsafe-return
  */

  // Control de CORS
  await app.register(fastifyCors, {
    origin: [
      `http://127.0.0.1:3000`,
      `http://localhost:3000`,
      `http://127.0.0.1:3001`,
      `http://localhost:3001`
    ],
    methods: ["GET", "PUT", "POST", "DELETE", "PATCH"],
    credentials: true
  })

  // Seguridad Helmet
  await app.register(fastifyHelmet, { global: true })

  // Configuración global
  app.setGlobalPrefix(envs.API_PREFIX)
  app.useGlobalFilters(new GlobalExceptionFilter())
  app.useGlobalPipes(gValidationPipes())

  await app.register(fastifyCookie)

  if (isDevelopment) {
    const config = new DocumentBuilder()
      .setTitle(envs.PROJECT)
      .setDescription("Api documentacion")
      .setVersion("1.0")
      .addServer(`${envs.PROTOCOLO}://${envs.IP_SERVER}:${envs.PORT}`)
      .build()

    const documentFactory = () => SwaggerModule.createDocument(app, config)
    SwaggerModule.setup(envs.DOC_SWAGGER, app, documentFactory, {
      jsonDocumentUrl: envs.URL_JSON_SWAGGER
    })
  }

  await app.listen(envs.PORT, envs.LISTEN_SERVER)

  if (isDevelopment) {
    Logger.log(`Servidor: ${envs.PROTOCOLO}://${envs.IP_SERVER}:${envs.PORT}/${envs.API_PREFIX}`)
    Logger.log(
      `Docs-Json: ${envs.PROTOCOLO}://${envs.IP_SERVER}:${envs.PORT}/${envs.URL_JSON_SWAGGER}`
    )
    Logger.log(`Docs: ${envs.PROTOCOLO}://${envs.IP_SERVER}:${envs.PORT}/${envs.DOC_SWAGGER}`)
  }
}

bootstrap().catch(handleError)

function handleError(error: unknown) {
  console.error(error)
  process.exit(1)
}

process.on("uncaughtException", handleError)
