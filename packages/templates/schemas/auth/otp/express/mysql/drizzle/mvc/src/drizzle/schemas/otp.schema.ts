import {
  mysqlTable,
  serial,
  varchar,
  boolean,
  timestamp,
  int,
  mysqlEnum,
  index
} from "drizzle-orm/mysql-core";

export const OTP_MAX_ATTEMPTS = 5;

export const OTP_TYPES = [
  "signin",
  "email-verification",
  "password-reset",
  "password-change"
] as const;

export type OTPType = (typeof OTP_TYPES)[number];

export const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull()
};

export const otps = mysqlTable(
  "otps",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    otpHashCode: varchar("otp_hash_code", { length: 255 }).notNull(),
    nextResendAllowedAt: timestamp("next_resend_allowed_at").notNull(),
    type: mysqlEnum("type", OTP_TYPES).notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    isUsed: boolean("is_used").default(false).notNull(),
    usedAt: timestamp("used_at"),
    attempts: int("attempts").default(0).notNull(),
    maxAttempts: int("max_attempts").default(OTP_MAX_ATTEMPTS).notNull(),
    ...timestamps
  },
  table => [
    index("email_type_idx").on(table.email, table.type),
    index("expires_at_idx").on(table.expiresAt),
    index("is_used_idx").on(table.isUsed)
  ]
);

export type Otp = typeof otps.$inferSelect;
export type NewOtp = typeof otps.$inferInsert;
