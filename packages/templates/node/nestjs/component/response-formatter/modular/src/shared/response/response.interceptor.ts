import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from "@nestjs/common";

import { Reflector } from "@nestjs/core";

import { Observable, map } from "rxjs";

import { ApiResponse } from "./api-response";
import { RESPONSE_OPTIONS_KEY, ResponseOptions } from "./response.decorator";
import { Response } from "express";

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>
  ): Observable<ApiResponse<T>> {
    const response = context.switchToHttp().getResponse<Response>();

    const statusCode = response.statusCode;

    const options = this.reflector.getAllAndOverride<ResponseOptions>(
      RESPONSE_OPTIONS_KEY,
      [context.getHandler(), context.getClass()]
    );

    const message = options?.message ?? "Request successful";

    return next.handle().pipe(
      map(data => {
        if (data instanceof ApiResponse) {
          return data;
        }

        return new ApiResponse<T>({
          success: true,
          statusCode: statusCode,
          message,
          data
          // timestamp: new Date().toISOString(),
        });
      })
    );
  }
}
