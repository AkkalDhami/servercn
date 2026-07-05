import { Request } from "express";

export interface UserRequest extends Request {
  user?: {
    id?: string | undefined;
    role?: "user" | "admin" | undefined;
    sessionId?: string | undefined;
  };
}
