import { NextFunction, Response } from "express";
import { UserRequest } from "../types/user";
import User from "../models/user.model";
import { ApiError } from "../utils/api-error";
import { logger } from "../utils/logger";

export async function checkUserAccountRestriction(
  req: UserRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user?._id) {
      return next(ApiError.unauthorized("Unauthorized"));
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return next(ApiError.unauthorized("Unauthorized, please login."));
    }

    if (user.isDeleted || user.deletedAt) {
      return next(ApiError.forbidden("Your account has been deactivated."));
    }

    if (user.lockUntil && user.lockUntil.getTime() > Date.now()) {
      const minutesLeft = Math.ceil(
        (user.lockUntil.getTime() - Date.now()) / (1000 * 60)
      );

      return next(
        ApiError.forbidden(
          `Your account has been locked. Please try again after ${minutesLeft} minutes.`
        )
      );
    }

    if (!user.isEmailVerified) {
      return next(
        ApiError.forbidden("Email not verified. Please verify your email.")
      );
    }

    return next();
  } catch (err: any) {
    logger.error(err?.message || err);
    return next(ApiError.server("Something went wrong"));
  }
}
