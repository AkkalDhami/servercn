import {
  pgTable,
  serial,
  varchar,
  boolean,
  timestamp,
  integer,
  pgEnum,
  index
} from "drizzle-orm/pg-core";
import { timestamps } from "./schema.helper";

const OTP_MAX_ATTEMPTS = 5;

export const otpTypeEnum = pgEnum("otp_type", [
  "signin",
  "email-verification",
  "password-reset",
  "password-change"
]);

export const otps = pgTable(
  "otps",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    otpHashCode: varchar("otp_hash_code", { length: 255 }).notNull(),
    nextResendAllowedAt: timestamp("next_resend_allowed_at").notNull(),
    type: otpTypeEnum("type").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    isUsed: boolean("is_used").default(false).notNull(),
    usedAt: timestamp("used_at"),
    attempts: integer("attempts").default(0).notNull(),
    maxAttempts: integer("max_attempts").default(OTP_MAX_ATTEMPTS).notNull(),
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
