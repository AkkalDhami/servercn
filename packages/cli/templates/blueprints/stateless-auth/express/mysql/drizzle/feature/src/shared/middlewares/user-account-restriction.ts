import { NextFunction, Response } from "express";
import { ApiError } from "../utils/api-error";
import { logger } from "../utils/logger";
import db from "../configs/db";
import { eq } from "drizzle-orm";
import { users } from "../../drizzle";
import { UserRequest } from "../../types/global";

export async function checkUserAccountRestriction(
  req: UserRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user?.id) {
      return next(ApiError.unauthorized("Unauthorized"));
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.user.id))
      .limit(1);

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
