import { Request, Response, NextFunction } from "express";
import env from "../configs/env";

import { logger } from "../utils/logger";
import { ApiError } from "../errors/api-error";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Internal server error";

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  logger.error(
    `Error: ${message} | Status: ${statusCode} | Path: ${req.method} ${req.originalUrl}`,
    err
  );

  const response = {
    success: false,
    message,
    ...(env.NODE_ENV === "development" && { stack: err.stack })
  };

  res.status(statusCode).json(response);
};
