import { STATUS_CODES, StatusCode } from "../constants/status-codes";

export class ApiError extends Error {
  public readonly statusCode: StatusCode;
  public readonly isOperational: boolean;
  public readonly errors?: unknown;

  constructor(
    statusCode: StatusCode,
    message: string,
    errors?: unknown,
    isOperational = true
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = "Bad Request", errors?: unknown) {
    return new ApiError(STATUS_CODES.BAD_REQUEST, message, errors);
  }

  static unauthorized(message = "Unauthorized") {
    return new ApiError(STATUS_CODES.UNAUTHORIZED, message);
  }

  static forbidden(message = "Forbidden") {
    return new ApiError(STATUS_CODES.FORBIDDEN, message);
  }

  static notFound(message = "Not Found") {
    return new ApiError(STATUS_CODES.NOT_FOUND, message);
  }

  static conflict(message = "Conflict") {
    return new ApiError(STATUS_CODES.CONFLICT, message);
  }

  static server(message = "Internal Server Error") {
    return new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR, message);
  }

  static unprocessableEntity(message = "Unprocessable Entity") {
    return new ApiError(STATUS_CODES.UNPROCESSABLE_ENTITY, message);
  }

  static tooManyRequests(message = "Too Many Requests") {
    return new ApiError(STATUS_CODES.TOO_MANY_REQUESTS, message);
  }
}

/*
  ? Usage:
  * throw new ApiError(404, "Not found");
  * throw ApiError.badRequest("Bad request");
 */
