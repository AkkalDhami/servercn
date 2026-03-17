import { Request } from "express";

export interface UserRequest extends Request {
  user?: {
    _id?: string;
    role?: "user" | "admin" | undefined;
  };
  session?: {
    _id?: string;
    token?: string;
  };
}
