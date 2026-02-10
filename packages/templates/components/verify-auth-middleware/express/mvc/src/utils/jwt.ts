import jwt from "jsonwebtoken";
import env from "../configs/env";

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

// Generate a short-lived access token
export function generateAccessToken(user: { _id: string }) {
  return jwt.sign({ _id: user._id }, env.JWT_ACCESS_SECRET!, {
    expiresIn: ACCESS_TOKEN_EXPIRY
  });
}

// Generate a long-lived refresh token
export function generateRefreshToken(userId: string) {
  return jwt.sign({ userId }, env.JWT_REFRESH_SECRET!, {
    expiresIn: REFRESH_TOKEN_EXPIRY
  });
}

// Verify and decode an access token
export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET!) as {
    _id: string;
  };
}

// Verify and decode a refresh token
export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET!) as {
    userId: string;
  };
}
