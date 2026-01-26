import { OTP_TYPES } from "./auth.constants";

export type OTPType = (typeof OTP_TYPES)[number];

export interface IAvatar {
  public_id?: string;
  url: string;
  size?: number;
}

export interface IUser {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: "user" | "admin";
  isEmailVerified: boolean;
  lastLoginAt?: Date;
  failedLoginAttempts: number;
  lockUntil?: Date;
  avatar?: IAvatar;
  provider: "local" | "google" | "github";
  providerId?: string;
  isDeleted: boolean;
  deletedAt?: Date;
  reActivateAvailableAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
