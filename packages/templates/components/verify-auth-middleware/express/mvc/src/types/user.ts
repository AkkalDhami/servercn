import { Request } from "express";
import mongoose from "mongoose";

export interface UserRequest extends Request {
  user?: {
    _id?: string | mongoose.Types.ObjectId;
  };
}
