import mongoose, { Document, Model, Schema } from "mongoose";

export const OTP_MAX_ATTEMPTS = 5;
export const OTP_TYPES = [
  "signin",
  "email-verification",
  "password-reset",
  "password-change"
] as const;
export const NEXT_OTP_DELAY = 1 * 60 * 1000; // 1 minute
export const OTP_CODE_LENGTH = 6 as const;
export const OTP_EXPIRES_IN = 5 * 60 * 1000; // 5 minutes

export type OTPType = (typeof OTP_TYPES)[number];

//? otp interface
export interface IOtp extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  otpHashCode: string;
  nextResendAllowedAt: Date;
  type: OTPType;
  expiresAt: Date;
  isUsed: boolean;
  usedAt?: Date;
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
  updatedAt: Date;
}

//? otp schema
const otpSchema = new Schema<IOtp>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true
    },
    otpHashCode: {
      type: String,
      required: [true, "OTP hash code is required"],
      select: false // Never return OTP hash code in queries by default
    },
    nextResendAllowedAt: {
      type: Date,
      required: [true, "Next resend allowed at is required"]
    },
    type: {
      type: String,
      enum: OTP_TYPES,
      required: [true, "OTP type is required"]
    },
    expiresAt: {
      type: Date,
      required: [true, "Expiration time is required"]
    },
    isUsed: {
      type: Boolean,
      default: false
    },
    usedAt: {
      type: Date
    },
    attempts: {
      type: Number,
      default: 0
    },
    maxAttempts: {
      type: Number,
      default: OTP_MAX_ATTEMPTS // Prevent brute force attacks
    }
  },
  {
    timestamps: true
  }
);

// Performance Indexes
otpSchema.index({ email: 1, type: 1 }); // Quick lookup by email and type
otpSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: OTP_EXPIRES_IN / 1000 } // 5 minutes
); // ttl index

const Otp: Model<IOtp> =
  mongoose.models.Otp || mongoose.model<IOtp>("Otp", otpSchema);

export default Otp;
