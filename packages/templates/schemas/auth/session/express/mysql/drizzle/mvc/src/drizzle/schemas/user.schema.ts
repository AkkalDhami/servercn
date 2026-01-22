import {
  mysqlTable,
  serial,
  varchar,
  boolean,
  timestamp,
  uniqueIndex,
  mysqlEnum,
  int,
  json,
  index
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { sessions } from "./session.schema";

export interface IAvatar {
  public_id: string;
  url: string;
  size: number;
}

export const users = mysqlTable(
  "users",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }),
    role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),

    // OAuth Provider
    provider: mysqlEnum("provider", ["local", "google", "github"])
      .default("local")
      .notNull(),
    providerId: varchar("provider_id", { length: 255 }),

    // Profile
    avatar: json("avatar").$type<IAvatar>(),

    // Auth Metadata
    isEmailVerified: boolean("is_email_verified").default(false).notNull(),
    lastLoginAt: timestamp("last_login_at"),
    failedLoginAttempts: int("failed_login_attempts").default(0).notNull(),
    lockUntil: timestamp("lock_until"),

    // Soft Delete
    isDeleted: boolean("is_deleted").default(false).notNull(),
    deletedAt: timestamp("deleted_at"),
    reActivateAvailableAt: timestamp("re_activate_available_at"),

    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .onUpdateNow()
      .notNull()
  },
  table => [
    uniqueIndex("email_idx").on(table.email),
    index("role_idx").on(table.role),
    index("is_deleted_idx").on(table.isDeleted)
  ]
);

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions)
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
