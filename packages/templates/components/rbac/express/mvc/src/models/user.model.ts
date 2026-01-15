import mongoose, { Document, Model, Schema } from "mongoose";
import { USER_ROLES, userRoles } from "../types/user";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: userRoles;
  isEmailVerified: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      select: false,
      default: null
    },
    role: {
      type: String,
      enum: USER_ROLES,
      default: "user"
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
