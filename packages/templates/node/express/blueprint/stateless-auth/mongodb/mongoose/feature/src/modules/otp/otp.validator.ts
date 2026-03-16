import z from "zod";
import { emailSchema } from "../auth/auth.validator";
import { OTP_TYPES } from "./otp.constants";

export const RequestOtpSchema = z.object({
  email: emailSchema,
  otpType: z.enum(OTP_TYPES, { error: "Invalid otp type" })
});

export const VerifyOtpSchema = z.object({
  otpCode: z.string().min(6, "Please enter a valid OTP"),
  email: emailSchema,
  otpType: z.enum(OTP_TYPES, { error: "Invalid otp type" })
});

export type RequestOtpType = z.infer<typeof RequestOtpSchema>;
export type VerifyOtpType = z.infer<typeof VerifyOtpSchema>;
