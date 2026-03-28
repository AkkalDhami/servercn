/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Response } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { ApiError } from "../utils/api-error";
import redisClient from "../configs/redis";
import { UserRequest } from "../../types/global";
import { SessionData } from "../../modules/auth/auth.types";

export async function verifyAuthentication(
  req: UserRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  const accessToken = req.cookies?.accessToken || token;
  if (!accessToken) {
    return next(ApiError.unauthorized("Missing access token"));
  }

  try {
    const decoded = verifyAccessToken(accessToken);

    const sessionKey = `session:${decoded.sessionId}`;
    const sessionData = await redisClient.get(sessionKey);
    if (!sessionData) {
      return next(ApiError.unauthorized("Session not found"));
    }

    const session = JSON.parse(sessionData) as SessionData;

    if (session.ip !== req.ip) {
      return next(ApiError.unauthorized("Suspicious session"));
    }

    if (session.userAgent !== req.headers["user-agent"]) {
      return next(ApiError.unauthorized("Suspicious session"));
    }

    if (session.expiresAt < new Date()) {
      return next(ApiError.unauthorized("Session expired"));
    }

    req.user = decoded;
    return next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return next(ApiError.unauthorized("Access token expired"));
    }
    return next(ApiError.unauthorized("Invalid access token"));
  }
}
