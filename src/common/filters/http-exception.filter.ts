import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse } from '../interfaces/api-response.interface';

interface HttpExceptionResponse {
  message: string | string[];
  error?: string;
  statusCode?: number;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: string[] | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as
        | string
        | HttpExceptionResponse;

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else {
        const exMsg = exceptionResponse.message;
        if (Array.isArray(exMsg)) {
          message = 'Validation failed';
          errors = exMsg;
        } else {
          message = exMsg || exception.message;
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(
        `Unhandled Exception: ${exception.message}`,
        exception.stack,
      );
    }

    this.logger.warn(
      `[${request.method}] ${request.url} → ${status}: ${message}`,
    );

    const errorResponse: ApiResponse<null> & { errors?: string[] } = {
      success: false,
      statusCode: status,
      message,
      data: null,
      meta: null,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    if (errors) {
      errorResponse.errors = errors;
    }

    response.status(status).json(errorResponse);
  }
}
