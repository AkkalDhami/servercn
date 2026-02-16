import { NextFunction, Request, Response } from "express";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
} from "../utils/jwt";
import { ApiError } from "../utils/api-error";
import { logger } from "../utils/logger";
import User from "../models/user.model";
import env from "../configs/env";
import { UserRequest } from "../types/user";
import { setAuthCookies } from "../helpers/cookie.helper";
import RefreshToken from "../models/refresh-token.model";
import { generateHashedToken } from "../helpers/token.helpers";

const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000;

export async function verifyAuthentication(
  req: UserRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const accessToken = req.cookies?.accessToken;
  const refreshToken = req.cookies?.refreshToken;

  //? 1. Try access token
  if (accessToken) {
    try {
      const decoded = verifyAccessToken(accessToken);
      req.user = decoded;
      return next();
    } catch {
      logger.warn("Access token expired or invalid, attempting refresh");
    }
  }

  //? 2. Refresh token required
  if (!refreshToken) {
    return next(ApiError.unauthorized("Unauthorized, please login."));
  }

  try {
    const decodedRefresh = verifyRefreshToken(refreshToken);
    if (!decodedRefresh?.userId) {
      return next(ApiError.unauthorized("Invalid refresh token."));
    }

    const refreshTokenHash = generateHashedToken(refreshToken);

    const storedToken = await RefreshToken.findOne({
      userId: decodedRefresh.userId,
      tokenHash: refreshTokenHash
    });

    //? Reuse detection
    if (!storedToken) {
      await RefreshToken.updateMany(
        { userId: decodedRefresh.userId },
        { isRevoked: true, revokedAt: new Date() }
      );
      return next(
        ApiError.unauthorized("Token reuse detected. Please login again.")
      );
    }

    if (storedToken.isRevoked) {
      return next(ApiError.unauthorized("Refresh token revoked."));
    }

    if (storedToken.expiresAt < new Date()) {
      return next(ApiError.unauthorized("Refresh token expired."));
    }

    const user = await User.findById(storedToken.userId);
    if (!user) {
      return next(ApiError.unauthorized("User not found."));
    }

    //? 3. Rotate tokens
    const newAccessToken = generateAccessToken({
      _id: user._id.toString(),
      role: user.role
    });

    const newRefreshToken = generateRefreshToken(user._id.toString());
    const newRefreshTokenHash = generateHashedToken(newRefreshToken);

    storedToken.isRevoked = true;
    storedToken.revokedAt = new Date();
    storedToken.replacedByTokenHash = newRefreshTokenHash;
    await storedToken.save();

    await RefreshToken.create({
      userId: user._id,
      tokenHash: newRefreshTokenHash,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY)
    });

    setAuthCookies(res, newAccessToken, newRefreshToken);

    req.user = {
      _id: user._id.toString(),
      role: user.role
    };

    return next();
  } catch (err) {
    logger.warn("Refresh token verification failed");
    return next(ApiError.unauthorized("Unauthorized, please login."));
  }
}
