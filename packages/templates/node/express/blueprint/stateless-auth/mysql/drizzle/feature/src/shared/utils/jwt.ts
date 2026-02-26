import jwt from "jsonwebtoken";
import env from "../configs/env";

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

export function generateAccessToken(user: { id: number; role: string }) {
  return jwt.sign({ id: user.id, role: user.role }, env.JWT_ACCESS_SECRET!, {
    expiresIn: ACCESS_TOKEN_EXPIRY
  });
}

export function generateRefreshToken(userId: number) {
  return jwt.sign({ userId }, env.JWT_REFRESH_SECRET!, {
    expiresIn: REFRESH_TOKEN_EXPIRY
  });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET!) as {
    id: number;
    role: "user" | "admin";
  };
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET!) as {
    userId: number;
  };
}
