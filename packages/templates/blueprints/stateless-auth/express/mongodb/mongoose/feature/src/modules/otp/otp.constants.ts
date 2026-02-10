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
