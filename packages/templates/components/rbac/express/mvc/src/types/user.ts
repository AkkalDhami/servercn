import { Request } from "express";
import mongoose from "mongoose";

export const USER_ROLES = ["admin", "user", "super-admin"] as const;
export type userRoles = (typeof USER_ROLES)[number];

export interface UserRequest extends Request {
  user?: {
    _id: string | mongoose.Types.ObjectId;
    role: userRoles;
    email: string;
    [key: string]: any;
  };
}
