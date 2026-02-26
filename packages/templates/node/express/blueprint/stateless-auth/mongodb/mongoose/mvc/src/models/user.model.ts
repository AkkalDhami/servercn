import mongoose, { Document, Model, Schema } from "mongoose";

export interface IAvatar {
  public_id: string;
  url: string;
  size: number;
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  role: "user" | "admin";
  isEmailVerified: boolean;
  lastLoginAt?: Date;
  failedLoginAttempts: number;
  lockUntil?: Date;
  avatar?: IAvatar;

  provider: "local" | "google" | "github";
  providerId?: string;

  isDeleted: boolean;
  deletedAt?: Date | null;
  reActivateAvailableAt?: Date | null;

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
    provider: {
      type: String,
      enum: ["local", "google", "github"],
      default: "local"
    },
    providerId: {
      type: String,
      default: null
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    avatar: {
      public_id: String,
      url: String,
      size: Number
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    lastLoginAt: {
      type: Date
    },
    failedLoginAttempts: {
      type: Number,
      required: true,
      default: 0
    },
    lockUntil: {
      type: Date
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    deletedAt: {
      type: Date,
      default: null
    },
    reActivateAvailableAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Performance Indexes
userSchema.index({ email: 1 });
userSchema.index({ provider: 1, providerId: 1 }); // Quick lookup for OAuth
userSchema.index({ role: 1 });
userSchema.index({ isDeleted: 1 }); // Optimized for soft-delete queries

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
