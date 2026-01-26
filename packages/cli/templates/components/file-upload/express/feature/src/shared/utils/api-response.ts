import { STATUS_CODES, StatusCode } from "../constants/status-codes";
import type { Response } from "express";

type ApiResponseParams<T> = {
  success: boolean;
  message: string;
  statusCode: StatusCode;
  data?: T | null;
  errors?: unknown;
};

export class ApiResponse<T = unknown> {
  public readonly success: boolean;
  public readonly message: string;
  public readonly statusCode: StatusCode;
  public readonly data?: T | null;
  public readonly errors?: unknown;

  constructor({
    success,
    message,
    statusCode,
    data = null,
    errors
  }: ApiResponseParams<T>) {
    this.success = success;
    this.message = message;
    this.statusCode = statusCode;
    this.data = data;
    this.errors = errors;
  }

  send(res: Response): Response {
    return res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      statusCode: this.statusCode,
      ...(this.data !== undefined && { data: this.data }),
      ...(this.errors !== undefined && { errors: this.errors })
    });
  }

  static Success<T>(
    res: Response,
    message: string,
    data?: T,
    statusCode: StatusCode = 200
  ): Response {
    return new ApiResponse<T>({
      success: true,
      message,
      data,
      statusCode
    }).send(res);
  }

  static ok<T>(res: Response, message = "OK", data?: T) {
    return ApiResponse.Success(res, message, data, STATUS_CODES.OK);
  }

  static created<T>(res: Response, message = "Created", data?: T) {
    return ApiResponse.Success(res, message, data, STATUS_CODES.CREATED);
  }
}

/*
 * Usage:
 * ApiResponse.ok(res, "OK", data);
 * ApiResponse.created(res, "Created", data);
 */
