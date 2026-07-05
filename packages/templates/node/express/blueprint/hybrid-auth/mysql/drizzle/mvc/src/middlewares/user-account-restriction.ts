/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Response } from "express";
import { UserRequest } from "../types/user";
import db from "../configs/db";
import { users } from "../db/schemas/user.schema";
import { eq } from "drizzle-orm";
import { ApiError } from "../utils/api-error";
import { logger } from "../utils/logger";
import { getRemainingTime } from "@/utils/date";

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
      .where(eq(users.id, parseInt(req?.user?.id || "0")));

    if (!user) {
      return next(ApiError.unauthorized("Unauthorized, please login."));
    }

    if (user.isDeleted || user.deletedAt) {
      return next(ApiError.forbidden("Your account has been deactivated."));
    }

    if (user.lockUntil && user.lockUntil.getTime() > Date.now()) {
      const remainingTime = getRemainingTime(user.lockUntil);

      return next(
        ApiError.forbidden(
          `Your account has been locked. Please try again after ${remainingTime.minutes} minutes and ${remainingTime.seconds} seconds.`
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
