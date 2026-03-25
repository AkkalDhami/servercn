import jwt from "jsonwebtoken";

export function decodeToken<T = unknown>(token: string): T | null {
  return jwt.decode(token) as T | null;
}

export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader) return null;

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return null;
  }

  return parts[1];
}
