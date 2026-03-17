import mongoose, { Document, Schema, Model } from "mongoose";
import { SESSION_EXPIRES_IN } from "./auth.constants";

export interface ISession extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  tokenHash: string;
  ip?: string;
  userAgent?: string;
  isActive: boolean;
  lastUsedAt: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema: Schema<ISession> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true
    },
    ip: {
      type: String
    },
    userAgent: {
      type: String
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastUsedAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Supporting indexes (non-TTL)
sessionSchema.index({ userId: 1, isActive: 1 });
sessionSchema.index({ userId: 1, lastUsedAt: -1 });
sessionSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: SESSION_EXPIRES_IN / 1000 } // 7 days
);

const Session: Model<ISession> =
  mongoose.models.Session || mongoose.model<ISession>("Session", sessionSchema);

export default Session;
