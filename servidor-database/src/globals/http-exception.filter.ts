import { ValidationError } from "class-validator"
import { FastifyReply, FastifyRequest } from "fastify"

import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  UnauthorizedException
} from "@nestjs/common"

import { Prisma } from "~prisma/prisma-client"

import { CustomError } from "./custom.errors"
import { EnumError400, EnumError401, EnumError500, Error400, Error401, Error500 } from "./errors"

export interface ErrorCustomEntity {
  statusCode: HttpStatus
  title?: string
  message: string
  subMessage?: string
  tag?: string
  details?: object
}

export interface CustomGlobalErrorResponse extends ErrorCustomEntity {
  // originalMessageException: any
  path: string
  timestamp: string
  validations?: ValidationError[]
  code: number
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()
    const request = ctx.getRequest<FastifyRequest>()

    // Inicializar body base
    let body: CustomGlobalErrorResponse = {
      code: 0,
      path: request.url,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
      message: "Error"
    }

    // Manejar errores HTTP estándar de NestJS
    if (exception instanceof CustomError) {
      body = this.handleCustomError(exception, body)
    } else if (exception instanceof UnauthorizedException) {
      body = this.handleUnauthorizedException(exception, body)
    } else if (exception instanceof BadRequestException) {
      body = this.handleBadRequestException(exception, body)
    } else if (exception instanceof HttpException) {
      body = this.handleHttpException(exception, body)
    }
    // Manejar errores no-HTTP (Prisma, Error genérico, etc.)
    else if (this.isPrismaError(exception)) {
      body = this.handlePrismaError(exception, body)
    } else if (exception instanceof Error) {
      body = this.handleGenericError(exception, body)
    } else {
      body = this.handleUnknownError(exception, body)
    }

    response.status(body.statusCode).send(body)
  }

  /**
   * Maneja errores personalizados de la aplicación (CustomError)
   */
  private handleCustomError(
    exception: CustomError,
    body: CustomGlobalErrorResponse
  ): CustomGlobalErrorResponse {
    this.logger.warn(`CustomError [${exception.code}]: ${exception.message}`)
    return {
      ...body,
      code: exception.code,
      ...exception.base
    }
  }

  /**
   * Maneja errores de autorización
   */
  private handleUnauthorizedException(
    exception: UnauthorizedException,
    body: CustomGlobalErrorResponse
  ): CustomGlobalErrorResponse {
    this.logger.warn(`Unauthorized: ${exception.message}`)
    return {
      ...body,
      code: EnumError401.NoAutorizado,
      ...Error401[EnumError401.NoAutorizado]
    }
  }

  /**
   * Maneja errores de solicitud incorrecta (incluye validaciones)
   */
  private handleBadRequestException(
    exception: BadRequestException,
    body: CustomGlobalErrorResponse
  ): CustomGlobalErrorResponse {
    this.logger.warn(`Bad Request: ${exception.message}`)

    const result: CustomGlobalErrorResponse = {
      ...body,
      code: EnumError400.SolicitudIncorrecta,
      ...Error400[EnumError400.SolicitudIncorrecta]
    }

    const errorResponse: string | object = exception.getResponse()
    if (typeof errorResponse === "object" && "message" in errorResponse) {
      result.validations = errorResponse["message"] as ValidationError[]
    }

    return result
  }

  /**
   * Maneja otras excepciones HTTP de NestJS
   */
  private handleHttpException(
    exception: HttpException,
    body: CustomGlobalErrorResponse
  ): CustomGlobalErrorResponse {
    const status = exception.getStatus()
    this.logger.warn(`HTTP Exception [${status}]: ${exception.message}`)
    return {
      ...body,
      statusCode: status,
      message: exception.message
    }
  }

  /**
   * Verifica si el error es de Prisma
   */
  private isPrismaError(exception: unknown): boolean {
    return (
      exception instanceof Prisma.PrismaClientKnownRequestError ||
      exception instanceof Prisma.PrismaClientValidationError ||
      exception instanceof Prisma.PrismaClientRustPanicError ||
      exception instanceof Prisma.PrismaClientInitializationError ||
      exception instanceof Prisma.PrismaClientUnknownRequestError
    )
  }

  /**
   * Maneja todos los tipos de errores de Prisma
   */
  private handlePrismaError(
    exception: unknown,
    body: CustomGlobalErrorResponse
  ): CustomGlobalErrorResponse {
    // Errores conocidos de Prisma (con código específico)
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      return this.handlePrismaKnownError(exception, body)
    }

    // Error de validación de Prisma
    if (exception instanceof Prisma.PrismaClientValidationError) {
      this.logger.error(`Prisma Validation Error: ${exception.message}`)
      return {
        ...body,
        code: EnumError500.ErrorPrismaValidation,
        ...Error500[EnumError500.ErrorPrismaValidation]
      }
    }

    // Error de inicialización de Prisma (conexión, etc.)
    if (exception instanceof Prisma.PrismaClientInitializationError) {
      this.logger.error(
        `Prisma Initialization Error [${exception.errorCode}]: ${exception.message}`
      )
      return {
        ...body,
        code: EnumError500.ErrorPrismaConnection,
        ...Error500[EnumError500.ErrorPrismaConnection]
      }
    }

    // Error de panic de Rust
    if (exception instanceof Prisma.PrismaClientRustPanicError) {
      this.logger.error(`Prisma Rust Panic: ${exception.message}`)
      return {
        ...body,
        code: EnumError500.ErrorPrisma,
        ...Error500[EnumError500.ErrorPrisma]
      }
    }

    // Cualquier otro error de Prisma
    this.logger.error(`Unknown Prisma Error: ${String(exception)}`)
    return {
      ...body,
      code: EnumError500.ErrorPrisma,
      ...Error500[EnumError500.ErrorPrisma]
    }
  }

  /**
   * Maneja errores conocidos de Prisma según su código
   * @see https://www.prisma.io/docs/reference/api-reference/error-reference
   */
  private handlePrismaKnownError(
    exception: Prisma.PrismaClientKnownRequestError,
    body: CustomGlobalErrorResponse
  ): CustomGlobalErrorResponse {
    const prismaCode = exception.code
    this.logger.error(`Prisma Error [${prismaCode}]: ${exception.message}`)

    // P2002: Unique constraint violation
    if (prismaCode === "P2002") {
      return {
        ...body,
        code: EnumError500.ErrorPrismaUniqueConstraint,
        ...Error500[EnumError500.ErrorPrismaUniqueConstraint]
      }
    }

    // P2003: Foreign key constraint violation
    if (prismaCode === "P2003") {
      return {
        ...body,
        code: EnumError500.ErrorPrismaForeignKeyConstraint,
        ...Error500[EnumError500.ErrorPrismaForeignKeyConstraint]
      }
    }

    // P2025: Record not found
    if (prismaCode === "P2025") {
      return {
        ...body,
        code: EnumError500.ErrorPrismaRecordNotFound,
        ...Error500[EnumError500.ErrorPrismaRecordNotFound]
      }
    }

    // P1008, P1017: Timeout
    if (prismaCode === "P1008" || prismaCode === "P1017") {
      return {
        ...body,
        code: EnumError500.ErrorPrismaTimeout,
        ...Error500[EnumError500.ErrorPrismaTimeout]
      }
    }

    // Cualquier otro error conocido de Prisma
    return {
      ...body,
      code: EnumError500.ErrorPrisma,
      ...Error500[EnumError500.ErrorPrisma]
    }
  }

  /**
   * Maneja errores genéricos de JavaScript (throw new Error)
   */
  private handleGenericError(
    exception: Error,
    body: CustomGlobalErrorResponse
  ): CustomGlobalErrorResponse {
    this.logger.error(`Generic Error: ${exception.message}`, exception.stack)
    return {
      ...body,
      code: EnumError500.ErrorGenerico,
      ...Error500[EnumError500.ErrorGenerico]
    }
  }

  /**
   * Maneja errores desconocidos (cualquier otro tipo)
   */
  private handleUnknownError(
    exception: unknown,
    body: CustomGlobalErrorResponse
  ): CustomGlobalErrorResponse {
    this.logger.error(`Unknown Error: ${String(exception)}`)
    return {
      ...body,
      code: EnumError500.ErrorFueraDeCaptura,
      ...Error500[EnumError500.ErrorFueraDeCaptura]
    }
  }
}
