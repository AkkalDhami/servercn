import { NextFunction, Response } from "express";

import { ApiError } from "../utils/api-error";
import { UserRequest } from "@/types/global";
import { generateHashedToken } from "../helpers/token.helpers";
import Session from "@/modules/auth/session.model";
import User from "@/modules/auth/user.model";
import { SESSION_EXPIRES_IN } from "@/modules/auth/auth.constants";
import { logger } from "../utils/logger";

export async function verifyAuthentication(
  req: UserRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const sid = req.cookies?.sid;
    const authorization = req.headers.authorization;
    const token = authorization?.split(" ")[1];

    if (!sid && !token) {
      return next(ApiError.unauthorized("Unauthorized, please login."));
    }

    const hashedSession = generateHashedToken(sid || token);

    const session = await Session.findOne({
      tokenHash: hashedSession,
      isActive: true,
      expiresAt: { $gt: new Date() }
    });

    if (!session) {
      return next(ApiError.unauthorized("Session expired."));
    }

    if (
      session.userAgent !== req.headers["user-agent"] ||
      session.ip !== req.ip
    ) {
      return next(ApiError.unauthorized("Invalid session."));
    }

    const user = await User.findById(session.userId);

    if (!user) {
      return next(ApiError.unauthorized("User not found."));
    }
    req.user = {
      _id: user._id.toString(),
      role: user.role
    };

    req.session = {
      _id: session._id.toString(),
      token: sid || token
    };

    const remainingTime = session.expiresAt.getTime() - Date.now();
    const EXTEND_THRESHOLD = SESSION_EXPIRES_IN * 0.25;

    if (remainingTime < EXTEND_THRESHOLD) {
      await Session.updateOne(
        { _id: session._id.toString() },
        {
          $set: {
            lastUsedAt: new Date(),
            expiresAt: new Date(Date.now() + SESSION_EXPIRES_IN)
          }
        }
      );
    }

    return next();
  } catch (error) {
    logger.error(error, "Authentication verification failed");
    return next(
      ApiError.server("Internal server error during authentication.")
    );
  }
}
