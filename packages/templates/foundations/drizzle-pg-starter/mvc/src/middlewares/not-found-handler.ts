import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api-error";

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  throw ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`);
};
