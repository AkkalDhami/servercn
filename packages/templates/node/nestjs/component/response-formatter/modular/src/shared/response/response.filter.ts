import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException
} from "@nestjs/common";

import type { Response } from "express";

import { HttpStatus } from "@nestjs/common";

import { ApiResponse } from "./api-response";

@Catch()
export class ResponseExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    let statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

    let message = "Internal server error";
    let errors: unknown;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();

      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === "string") {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === "object" &&
        exceptionResponse !== null
      ) {
        const errorResponse = exceptionResponse as Record<string, unknown>;

        if (typeof errorResponse.message === "string") {
          message = errorResponse.message;
        }

        errors = errorResponse;
      }
    }

    const apiResponse = ApiResponse.error(message, statusCode, errors);

    response.status(statusCode).json(apiResponse);
  }
}
