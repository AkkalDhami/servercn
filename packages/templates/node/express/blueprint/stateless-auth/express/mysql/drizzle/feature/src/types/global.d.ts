import { Request } from "express";

export interface UserRequest extends Request {
  user?: {
    id?: number | undefined;
    role?: "user" | "admin" | undefined;
  };
}
