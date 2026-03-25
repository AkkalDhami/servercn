import jwt from "jsonwebtoken";
import {
  AccessTokenPayload,
  JwtPayload,
  RefreshTokenPayload
} from "./jwt.types";
import { JwtExpiredError, JwtInvalidError } from "./jwt.errors";

function verifyToken<T extends JwtPayload>(token: string, secret: string): T {
  try {
    return jwt.verify(token, secret) as T;
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      throw new JwtExpiredError();
    }
    throw new JwtInvalidError();
  }
}

export function verifyAccessToken(token: string) {
  return verifyToken(
    token,
    process.env.JWT_ACCESS_SECRET as string
  ) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string) {
  return verifyToken(
    token,
    process.env.JWT_REFRESH_SECRET as string
  ) as RefreshTokenPayload;
}
