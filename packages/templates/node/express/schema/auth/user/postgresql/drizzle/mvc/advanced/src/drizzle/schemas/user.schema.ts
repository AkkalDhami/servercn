import {
  pgTable,
  serial,
  varchar,
  boolean,
  timestamp,
  integer,
  jsonb,
  uniqueIndex,
  index,
  pgEnum
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin"]);
export const providerEnum = pgEnum("provider", ["local", "google", "github"]);

export const timestamps = {
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" })
    .defaultNow()
    .$onUpdate(() => new Date().toISOString())
    .notNull()
};

export interface IAvatar {
  public_id: string;
  url: string;
  size: number;
}

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }),
    role: roleEnum("role").default("user").notNull(),

    // OAuth Provider
    provider: providerEnum("provider").default("local").notNull(),
    providerId: varchar("provider_id", { length: 255 }),

    // Profile
    avatar: jsonb("avatar").$type<IAvatar>(),

    // Auth Metadata
    isEmailVerified: boolean("is_email_verified").default(false).notNull(),
    lastLoginAt: timestamp("last_login_at"),
    failedLoginAttempts: integer("failed_login_attempts").default(0).notNull(),
    lockUntil: timestamp("lock_until"),

    // Soft Delete
    isDeleted: boolean("is_deleted").default(false).notNull(),
    deletedAt: timestamp("deleted_at"),
    reActivateAvailableAt: timestamp("re_activate_available_at"),

    //? Timestamps
    ...timestamps
  },
  table => [
    uniqueIndex("email_idx").on(table.email),
    index("provider_idx").on(table.provider, table.providerId),
    index("role_idx").on(table.role),
    index("is_deleted_idx").on(table.isDeleted)
  ]
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
