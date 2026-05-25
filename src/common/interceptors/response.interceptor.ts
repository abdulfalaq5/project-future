import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const statusCode = ctx.getResponse().statusCode;

    return next.handle().pipe(
      map((data) => {
        // If the data already conforms to our ApiResponse format, return as-is
        if (
          data &&
          typeof data === 'object' &&
          'success' in data &&
          'statusCode' in data
        ) {
          return data as ApiResponse<T>;
        }

        // Wrap in standard format
        return {
          success: true,
          statusCode,
          message: 'Success',
          data: data ?? null,
          meta: null,
          timestamp: new Date().toISOString(),
          path: request.url,
        } as ApiResponse<T>;
      }),
    );
  }
}
