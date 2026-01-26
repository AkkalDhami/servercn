import jwt from "jsonwebtoken";
import env from "../configs/env";

const JWT_ACCESS_TOKEN_EXPIRY = "15m";
const JWT_REFRESH_TOKEN_EXPIRY = "7d";

export function generateAccessToken(user: {
  _id: string;
  role: "user" | "admin";
}) {
  return jwt.sign({ _id: user._id, role: user.role }, env.JWT_ACCESS_SECRET!, {
    expiresIn: JWT_ACCESS_TOKEN_EXPIRY
  });
}

export function generateRefreshToken(userId: string) {
  return jwt.sign({ userId }, env.JWT_REFRESH_SECRET!, {
    expiresIn: JWT_REFRESH_TOKEN_EXPIRY
  });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET!) as {
    _id: string;
  };
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET!) as {
    userId: string;
  };
}
