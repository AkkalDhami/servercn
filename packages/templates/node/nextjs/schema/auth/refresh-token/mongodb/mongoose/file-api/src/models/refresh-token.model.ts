import mongoose, { Document, Model, Schema } from "mongoose";

export const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface IRefreshToken extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  isRevoked: boolean;
  revokedAt?: Date;
  replacedByTokenHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"]
    },
    tokenHash: {
      type: String,
      required: [true, "Token hash is required"],
      select: false // Secure by default
    },
    expiresAt: {
      type: Date,
      required: [true, "Expiration time is required"]
    },
    isRevoked: {
      type: Boolean,
      default: false
    },
    revokedAt: {
      type: Date
    },
    replacedByTokenHash: {
      type: String,
      select: false
    }
  },
  {
    timestamps: true
  }
);

refreshTokenSchema.index({ userId: 1 });
refreshTokenSchema.index({ tokenHash: 1 });
refreshTokenSchema.index({ isRevoked: 1 });
refreshTokenSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: REFRESH_TOKEN_EXPIRY / 1000 } // 7 days
);

const RefreshToken: Model<IRefreshToken> =
  mongoose.models.RefreshToken ||
  mongoose.model<IRefreshToken>("RefreshToken", refreshTokenSchema);

export default RefreshToken;
