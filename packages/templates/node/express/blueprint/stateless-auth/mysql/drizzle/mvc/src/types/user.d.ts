import { Request } from "express";
import { OTP_TYPES } from "../constants/auth";
import { IAvatar } from "../drizzle";

export type OTPType = (typeof OTP_TYPES)[number];

export interface UserRequest extends Request {
  user?: {
    id?: number | undefined;
    role?: "user" | "admin" | undefined;
  };
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
