import { Request, Response, NextFunction } from "express";
import z, { ZodError, type ZodObject } from "zod";

import { ApiError } from "../utils/api-error";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateRequest = (schema: ZodObject<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);

      next();
    } catch (error) {
      if (!(error instanceof ZodError)) {
        return next(error);
      }

      return next(
        ApiError.badRequest(
          "Invalid request data",
          z.flattenError(error).fieldErrors || z.flattenError(error)
        )
      );
    }
  };
};
