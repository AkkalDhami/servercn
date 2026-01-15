import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from "../utils/jwt";
import { logger } from "../utils/logger";
import env from "../configs/env";
import { UserRequest } from "../../types/user";
import { ApiError } from "../errors/api-error";
import User from "../../modules/user/user.model";
import { NextFunction, Response } from "express";

const isProduction = env.NODE_ENV === "production";
const ACCESS_TOKEN_EXPIRY = 15 * 60 * 1000;
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000;

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? ("none" as const) : ("lax" as const),
  path: "/"
};

export async function verifyAuthentication(req: UserRequest, res: Response, next: NextFunction): Promise<void> {
  const accessToken = req.cookies?.accessToken;
  const refreshToken = req.cookies?.refreshToken;

  // Step 1: Try validating access token

  try {
    if (accessToken) {
      const decoded = verifyAccessToken(accessToken);
      req.user = decoded;
      return next();
    }
  } catch (err) {
    // Access token expired or invalid
    logger.warn("Access token verification failed");
    return next(ApiError.badRequest("Invalid or expired access token"));
  }

  // Step 2: Refresh token required if access token fails

  if (!refreshToken) {
    return next(ApiError.unauthorized("Unauthorized, Please login first."));
  }

  try {
    const decodedRefresh = verifyRefreshToken(refreshToken);

    // Step 3: Ensure user still exists

    const userInDb = await User.findOne({
      _id: decodedRefresh.userId
    });

    if (!userInDb) {
      return next(ApiError.unauthorized("Unauthorized, Please login first."));
    }

    // Step 4: Issue new tokens

    const userPayload = {
      _id: userInDb._id.toString(),
      role: userInDb.role,
      email: userInDb.email
    };
    const newAccessToken = generateAccessToken(userPayload);

    const newRefreshToken = generateRefreshToken(userInDb._id.toString());

    // Step 5: Saved accessToken and refreshToken in cookie
    res.cookie("accessToken", newAccessToken, {
      ...COOKIE_OPTIONS,
      maxAge: ACCESS_TOKEN_EXPIRY
    });

    res.cookie("refreshToken", newRefreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: REFRESH_TOKEN_EXPIRY
    });

    // Step 6: Attach user to request

    req.user = {
      _id: userInDb._id,
      role: userInDb.role,
      email: userInDb.email
    };

    // you can update the refresh token in the database here if you store it in the database

    return next();
  } catch (err: any) {
    logger.warn("Refresh token verification failed");
    return next(ApiError.unauthorized("Unauthorized, Please login first."));
  }
}
