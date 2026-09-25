export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }

  static badRequest(message: string) {
    return new ApiError(message, 400);
  }

  static notFound(message: string) {
    return new ApiError(message, 404);
  }

  internal(message: string) {
    return new ApiError(message, 500);
  }
}
