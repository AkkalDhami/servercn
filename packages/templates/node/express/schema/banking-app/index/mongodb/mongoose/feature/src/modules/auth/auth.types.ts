import { IAccount } from "../account/account.types";

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

export type UserProfile = Pick<
  IUser,
  "_id" | "name" | "email" | "avatar" | "role" | "isEmailVerified"
> & {
  accounts?: IAccount[];
};
