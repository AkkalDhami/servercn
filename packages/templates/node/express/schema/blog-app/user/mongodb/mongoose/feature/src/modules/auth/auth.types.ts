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

interface IAccount {
  _id: string;
  type: string;
  currency: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export type UserProfile = Pick<
  IUser,
  "_id" | "name" | "email" | "avatar" | "role" | "isEmailVerified"
> & {
  accounts?: IAccount[];
};
