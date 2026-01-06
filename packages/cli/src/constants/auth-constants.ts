export const MILLISECONDS_PER_SECOND = 1000 as const;
export const SECONDS_PER_MINUTE = 60 as const;
export const MINUTES_PER_HOUR = 60 as const;
export const HOURS_PER_DAY = 24 as const;
export const DAYS_PER_MONTH = 30 as const;
export const DAYS_PER_WEEK = 7 as const;

export const SESSION_EXPIRY = 5 * 24 * 60 * 60 * 1000; // 5 days

export const MAX_SESSIONS_LIMIT = 8 as const;

export const ACCESS_TOKEN_EXPIRY =
  25 * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND;

export const REFRESH_TOKEN_EXPIRY =
  DAYS_PER_WEEK *
  HOURS_PER_DAY *
  MINUTES_PER_HOUR *
  SECONDS_PER_MINUTE *
  MILLISECONDS_PER_SECOND;

export const OAUTH_EXCHANGE_EXPIRY =
  10 * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND;

export const OTP_CODE_LENGTH = 6 as const;

export const EMAIL_VERIFY_OTP_CODE_EXPIRY =
  5 * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND;

export const OTP_CODE_EXPIRY = 5 * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND;

export const OTP_TYPES = [
  "signin",
  "email-verification",
  "password-reset",
  "password-change",
] as const;

export const OTP_MAX_ATTEMPTS = 5 as const;

export const NEXT_OTP_DELAY = 1 * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND;

export const LOGIN_MAX_ATTEMPTS = 5 as const;

export const LOCK_TIME_MS =
  5 * 60 * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND;

export const RESET_PASSWORD_TOKEN_EXPIRY =
  5 * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND;

export const CHANGE_PASSWORD_TOKEN_EXPIRY =
  5 * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND;

export const STATUS_EXPIRY =
  HOURS_PER_DAY *
  MINUTES_PER_HOUR *
  SECONDS_PER_MINUTE *
  MILLISECONDS_PER_SECOND;

export const REACTIVATION_AVAILABLE_AT =
  6 *
  HOURS_PER_DAY *
  MINUTES_PER_HOUR *
  SECONDS_PER_MINUTE *
  MILLISECONDS_PER_SECOND;

export const USER_ROLES = [
  "OWNER",
  "ADMIN",
  "COORDINATOR",
  "ACCOUNTANT",
  "LIBRARIAN",
  "RECEPCIONIST",
  "TEACHER",
  "PARENT",
  "STUDENT",
  "GUEST",
  "DRIVER",
] as const;

export type userRoles = (typeof USER_ROLES)[number];
export type otpTypes = (typeof OTP_TYPES)[number];
