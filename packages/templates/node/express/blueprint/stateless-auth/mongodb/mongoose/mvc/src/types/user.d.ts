import { Request } from "express";
import { OTP_TYPES } from "../constants/auth";

export type OTPType = (typeof OTP_TYPES)[number];

export interface UserRequest extends Request {
  user?: {
    _id?: string | undefined;
    role?: "user" | "admin" | undefined;
  };
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: "user" | "admin";
  isEmailVerified: boolean;
  lastLoginAt?: Date;
  failedLoginAttempts: number;
  lockUntil?: Date;
  avatar?: {
    url: string;
    publicId: string;
    size: number;
  };
  provider: "local" | "google" | "github";
  providerId?: string;
  isDeleted: boolean;
  deletedAt?: Date;
  reActivateAvailableAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
