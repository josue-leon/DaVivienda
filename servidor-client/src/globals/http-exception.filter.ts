import { ValidationError } from 'class-validator';
import { FastifyReply, FastifyRequest } from 'fastify';

import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

import { CustomError } from './custom.errors';
import { EnumError400, EnumError401, Error400, Error401 } from './errors';

export interface ErrorCustomEntity {
  statusCode: HttpStatus;
  title?: string;
  message: string;
  subMessage?: string;
  tag?: string;
  details?: object;
}

export interface CustomGlobalErrorResponse extends ErrorCustomEntity {
  path: string;
  timestamp: string;
  validations?: ValidationError[];
  code: number;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    // Inicializar body base
    let body: CustomGlobalErrorResponse = {
      code: 0,
      path: request.url,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
      message: 'Error',
    };

    // Manejar errores HTTP estándar de NestJS
    if (exception instanceof CustomError) {
      body = this.handleCustomError(exception, body);
    } else if (exception instanceof UnauthorizedException) {
      body = this.handleUnauthorizedException(exception, body);
    } else if (exception instanceof BadRequestException) {
      body = this.handleBadRequestException(exception, body);
    } else if (exception instanceof HttpException) {
      body = this.handleHttpException(exception, body);
    }
    // Manejar errores genéricos
    else if (exception instanceof Error) {
      body = this.handleGenericError(exception, body);
    } else {
      body = this.handleUnknownError(exception, body);
    }

    response.status(body.statusCode).send(body);
  }

  /**
   * Maneja errores personalizados de la aplicación (CustomError)
   */
  private handleCustomError(
    exception: CustomError,
    body: CustomGlobalErrorResponse,
  ): CustomGlobalErrorResponse {
    this.logger.warn(`CustomError [${exception.code}]: ${exception.message}`);
    return {
      ...body,
      code: exception.code,
      ...exception.base,
    };
  }

  /**
   * Maneja errores de autorización
   */
  private handleUnauthorizedException(
    exception: UnauthorizedException,
    body: CustomGlobalErrorResponse,
  ): CustomGlobalErrorResponse {
    this.logger.warn(`Unauthorized: ${exception.message}`);
    return {
      ...body,
      code: EnumError401.NoAutorizado,
      ...Error401[EnumError401.NoAutorizado],
    };
  }

  /**
   * Maneja errores de solicitud incorrecta (incluye validaciones)
   */
  private handleBadRequestException(
    exception: BadRequestException,
    body: CustomGlobalErrorResponse,
  ): CustomGlobalErrorResponse {
    this.logger.warn(`Bad Request: ${exception.message}`);

    const result: CustomGlobalErrorResponse = {
      ...body,
      code: EnumError400.SolicitudIncorrecta,
      ...Error400[EnumError400.SolicitudIncorrecta],
    };

    const errorResponse: string | object = exception.getResponse();
    if (typeof errorResponse === 'object' && 'message' in errorResponse) {
      result.validations = errorResponse['message'] as ValidationError[];
    }

    return result;
  }

  /**
   * Maneja otras excepciones HTTP de NestJS (incluyendo errores del servidor-database)
   */
  private handleHttpException(
    exception: HttpException,
    body: CustomGlobalErrorResponse,
  ): CustomGlobalErrorResponse {
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    this.logger.warn(`HTTP Exception [${status}]: ${exception.message}`);

    // Si la respuesta es un objeto (error del servidor-database), usar tal cual
    if (typeof exceptionResponse === 'object') {
      return {
        ...body,
        ...exceptionResponse,
        statusCode: status,
      } as CustomGlobalErrorResponse;
    }

    return {
      ...body,
      statusCode: status,
      message: exceptionResponse,
    };
  }

  /**
   * Maneja errores genéricos de JavaScript (throw new Error)
   */
  private handleGenericError(
    exception: Error,
    body: CustomGlobalErrorResponse,
  ): CustomGlobalErrorResponse {
    this.logger.error(`Generic Error: ${exception.message}`, exception.stack);
    return {
      ...body,
      message: 'Error interno del servidor',
    };
  }

  /**
   * Maneja errores desconocidos (cualquier otro tipo)
   */
  private handleUnknownError(
    exception: unknown,
    body: CustomGlobalErrorResponse,
  ): CustomGlobalErrorResponse {
    this.logger.error(`Unknown Error: ${String(exception)}`);
    return {
      ...body,
      message: 'Error desconocido',
    };
  }
}
