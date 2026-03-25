import jwt from "jsonwebtoken";
import { AccessTokenPayload, JwtType, RefreshTokenPayload } from "./jwt.types";

export function signAccessToken(payload: {
  sub: string;
  email: string;
  sid: string;
}): string {
  const tokenPayload: AccessTokenPayload = {
    sub: payload.sub,
    type: JwtType.ACCESS,
    email: payload.email,
    sid: payload.sid
  };

  return jwt.sign(tokenPayload, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: "15m"
  });
}

export function signRefreshToken(payload: {
  sub: string;
  sid: string;
}): string {
  const tokenPayload: RefreshTokenPayload = {
    sub: payload.sub,
    type: JwtType.REFRESH,
    sid: payload.sid
  };

  return jwt.sign(tokenPayload, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: "7d"
  });
}
