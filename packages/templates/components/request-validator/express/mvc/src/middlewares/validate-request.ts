import { Request, Response, NextFunction } from "express";
import z, { ZodError, type ZodObject } from "zod";

import { ApiError } from "../utils/api-error";

export const validateRequest = (schema: ZodObject<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);

      next();
    } catch (error) {
      if (!(error instanceof ZodError)) {
        return next(error);
      }

      throw ApiError.badRequest("Invalid request data", z.flattenError(error).fieldErrors || z.flattenError(error));
    }
  };
};
