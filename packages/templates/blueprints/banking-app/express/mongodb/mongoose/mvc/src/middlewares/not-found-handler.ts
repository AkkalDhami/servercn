import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error";

export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  return next(
    ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`)
  );
};
