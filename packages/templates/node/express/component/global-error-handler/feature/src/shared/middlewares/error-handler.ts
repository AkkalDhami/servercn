import { Request, Response, NextFunction } from "express";
import env from "../configs/env";

import { ApiError } from "../errors/api-error";
import { logger } from "../utils/logger";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }
  let statusCode = 500;
  let message = "Internal server error";
  let errors: unknown;

  const apiError = err as ApiError;
  if (
    err instanceof ApiError ||
    (typeof apiError.statusCode === "number" &&
      apiError.statusCode >= 400 &&
      apiError.statusCode < 600)
  ) {
    statusCode = apiError.statusCode;
    message = apiError.message;
    errors = apiError.errors;
  }

  logger.error(
    err,
    `Error: ${message} | Status: ${statusCode} | Path: ${req.method} ${req.originalUrl}`
  );

  const response = {
    success: false,
    message,
    statusCode,
    ...(errors !== undefined && { errors }),
    ...(env.NODE_ENV === "development" && { stack: err.stack })
  };

  res.status(statusCode).json(response);
};
