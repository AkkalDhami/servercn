import { ApiError } from "../utils/api-error";
import { NextFunction, Request, Response } from "express";

export const validateObjectId = (paramName: string = "id") => {
  return (req: Request, res: Response, next: NextFunction) => {
    const value =
      req?.params[paramName] || req?.body[paramName] || req?.query[paramName];
    if (!value || typeof value !== "string" || value.trim().length === 0) {
      throw ApiError.badRequest(`Invalid ${paramName}`);
    }

    next();
  };
};
