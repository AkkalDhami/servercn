export const OTP_MAX_ATTEMPTS = 5;

export const OTP_MAX_COUNTS = 3;

export const OTP_TYPES = [
  "signin",
  "email-verification",
  "password-reset",
  "password-change"
] as const;

export const OTP_COOL_DOWN = 60;

export const NEXT_OTP_DELAY = 1 * 60 * 1000; // 1 minute

export const LOGIN_MAX_ATTEMPTS = 5 as const;

export const OTP_CODE_LENGTH = 6 as const;

export const OTP_EXPIRES_IN = 5 * 60 * 1000; // 5 minutes

export const LOCK_TIME_MS = 24 * 60 * 60 * 1000; // 24 hours

export const ACCESS_TOKEN_EXPIRY = 15 * 60 * 1000; // 15 minutes

export const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

export const RESET_PASSWORD_TOKEN_EXPIRY = 5 * 60 * 1000; // 5 minutes

export const REACTIVATION_AVAILABLE_AT = 1 * 60 * 1000; // 24 hours

export const OTP_SPAM_LOCK = 1 * 60 * 60 * 1000; // 1 hour
