import {
  mysqlTable,
  varchar,
  boolean,
  timestamp,
  int,
  json,
  uniqueIndex,
  index,
  mysqlEnum
} from "drizzle-orm/mysql-core";
import { sessions } from "./session.schema";
import { relations } from "drizzle-orm";

export interface IAvatar {
  public_id: string;
  url: string;
  size: number;
}

export const users = mysqlTable(
  "users",
  {
    id: int("id").primaryKey().autoincrement(),
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

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull()
  },
  table => [
    uniqueIndex("email_idx").on(table.email),
    index("role_idx").on(table.role),
    index("is_deleted_idx").on(table.isDeleted)
  ]
);

//? Relations between user and sessions.
//? One user can have many sessions.
//? (One-to-Many)
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions)
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
