import jwt from "jsonwebtoken";
import env from "../configs/env";

const JWT_ACCESS_TOKEN_EXPIRY = "15m";
const JWT_REFRESH_TOKEN_EXPIRY = "7d";

export function generateAccessToken(user: {
  _id: string;
  role: "user" | "admin";
  sessionId: string;
}) {
  return jwt.sign(
    { _id: user._id, role: user.role, sessionId: user.sessionId },
    env.JWT_ACCESS_SECRET!,
    {
      expiresIn: JWT_ACCESS_TOKEN_EXPIRY
    }
  );
}

export function generateRefreshToken(user: { _id: string; sessionId: string }) {
  return jwt.sign(
    { _id: user._id, sessionId: user.sessionId },
    env.JWT_REFRESH_SECRET!,
    {
      expiresIn: JWT_REFRESH_TOKEN_EXPIRY
    }
  );
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET!) as {
    _id: string;
    role: "user" | "admin";
    sessionId: string;
  };
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET!) as {
    _id: string;
    sessionId: string;
  };
}
