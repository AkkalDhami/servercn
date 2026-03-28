import { OTP_TYPES } from "@/modules/auth/auth.constants";

export type OTPType = (typeof OTP_TYPES)[number];

export interface AvatarData {
  public_id: string;
  url: string;
  size: number;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: "user" | "admin";
  isEmailVerified: boolean;
  lastLoginAt?: Date;
  failedLoginAttempts: number;
  lockUntil?: Date;
  avatar?: AvatarData | string | null;
  provider: "local" | "google" | "github" | "facebook";
  providerId?: string;
  isDeleted: boolean;
  deletedAt?: Date;
  reActivateAvailableAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type RefreshTokenData = {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
};

export type SessionData = {
  userId: string;
  sessionId: string;
  refreshTokenHash: string;
  userAgent: string;
  ip: string;
  createdAt: Date;
  expiresAt: Date;
};
