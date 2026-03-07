import { Request } from "express";

export interface UserRequest extends Request {
  user?: {
    _id?: string | undefined;
    role?: "user" | "admin" | undefined;
  };
}
