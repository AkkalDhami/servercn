import { NextFunction, Request, Response } from "express";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
} from "../utils/jwt";
import { ApiError } from "../utils/api-error";
import { logger } from "../utils/logger";
import { setAuthCookies } from "../helpers/cookie.helper";
import { generateHashedToken } from "../helpers/token.helpers";
import db from "../configs/db";
import { eq } from "drizzle-orm";
import { UserRequest } from "../../types/global";
import { refreshTokens, users } from "../../drizzle";

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

    const [storedToken] = await db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.tokenHash, refreshTokenHash));

    //? Reuse detection
    if (!storedToken) {
      await db
        .update(refreshTokens)
        .set({
          isRevoked: true,
          revokedAt: new Date()
        })
        .where(eq(refreshTokens.userId, decodedRefresh.userId));

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

    const [user] = await db
      .select({ id: users.id, role: users.role })
      .from(users)
      .where(eq(users.id, decodedRefresh.userId));
    if (!user) {
      return next(ApiError.unauthorized("User not found."));
    }

    //? 3. Rotate tokens
    const newAccessToken = generateAccessToken({
      id: user.id,
      role: user.role
    });

    const newRefreshToken = generateRefreshToken(user.id);
    const newRefreshTokenHash = generateHashedToken(newRefreshToken);

    await db
      .update(refreshTokens)
      .set({
        isRevoked: true,
        revokedAt: new Date(),
        replacedByTokenHash: newRefreshTokenHash
      })
      .where(eq(refreshTokens.id, storedToken.id));

    await db.insert(refreshTokens).values({
      userId: user.id,
      tokenHash: newRefreshTokenHash,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY)
    });

    setAuthCookies(res, newAccessToken, newRefreshToken);

    req.user = {
      id: user.id,
      role: user.role
    };

    return next();
  } catch (err) {
    logger.warn("Refresh token verification failed");
    return next(ApiError.unauthorized("Unauthorized, please login."));
  }
}
