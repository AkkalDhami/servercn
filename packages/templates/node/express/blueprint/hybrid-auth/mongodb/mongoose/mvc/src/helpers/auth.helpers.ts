import { OTPType } from "@/types/user";
import argon2 from "argon2";

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return argon2.verify(hash, password);
}

export const buildRedisKey = (
  email: string,
  otpType: OTPType,
  suffix: string
) => `otp:${suffix}:${email}:${otpType}`;
