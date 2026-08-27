import { HttpStatus } from "@nestjs/common";
import type {
  ApiResponseOptions,
  ErrorResponse,
  SuccessResponse
} from "./response.types";

export class ApiResponse<T = unknown> {
  public readonly success: boolean;
  public readonly message: string;
  public readonly statusCode: HttpStatus;
  public readonly data?: T | null;
  public readonly errors?: unknown;
  public readonly meta?: ApiResponseOptions<T>["meta"];

  constructor(options: ApiResponseOptions<T>) {
    this.success = options.success;
    this.message = options.message;
    this.statusCode = options.statusCode;
    this.data = options.data;
    this.errors = options.errors;
    this.meta = options.meta;
  }

  static success<T = unknown>(
    message: string,
    data?: T | null,
    statusCode = HttpStatus.OK,
    meta?: ApiResponseOptions<T>["meta"]
  ): ApiResponse<T> {
    return new ApiResponse<T>({
      success: true,
      message,
      statusCode,
      data,
      meta
    });
  }

  static ok<T = unknown>(
    message = "OK",
    data?: T | null,
    meta?: ApiResponseOptions<T>["meta"]
  ): ApiResponse<T> {
    return ApiResponse.success(message, data, HttpStatus.OK, meta);
  }

  static created<T = unknown>(
    message = "Created",
    data?: T | null
  ): ApiResponse<T> {
    return ApiResponse.success(message, data, HttpStatus.CREATED);
  }

  static accepted<T = unknown>(
    message = "Accepted",
    data?: T | null
  ): ApiResponse<T> {
    return ApiResponse.success(message, data, HttpStatus.ACCEPTED);
  }

  static error(
    message: string,
    statusCode: HttpStatus,
    errors?: unknown
  ): ApiResponse<never> {
    return new ApiResponse<never>({
      success: false,
      message,
      statusCode,
      errors
    });
  }

  toJSON(): SuccessResponse<T> | ErrorResponse {
    return {
      success: this.success,
      message: this.message,
      statusCode: this.statusCode,
      ...(this.data !== undefined && {
        data: this.data
      }),
      ...(this.meta !== undefined && {
        meta: this.meta
      }),
      ...(this.errors !== undefined && {
        errors: this.errors
      })
    };
  }
}
