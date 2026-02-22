import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/api-error";
import { UserRequest, userRoles } from "../types/user";

export const authorizeRoles = (...allowedRoles: userRoles[]) => {
  return (req: UserRequest, res: Response, next: NextFunction) => {
    // 1. Check if user is authenticated
    if (!req.user) {
      return next(ApiError.unauthorized("Unauthorized, Please login first."));
    }

    // 2. Check if user has required role
    // Note: Ensure 'role' exists on req.user. You might strictly type this.
    if (
      !req.user.role ||
      !allowedRoles.includes(req?.user?.role as userRoles)
    ) {
      return next(
        ApiError.forbidden(
          "Forbidden. You do not have permission to access this resource"
        )
      );
    }
    next();
  };
};
