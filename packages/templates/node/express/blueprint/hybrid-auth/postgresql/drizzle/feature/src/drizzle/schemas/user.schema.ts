import { 
  pgTable, 
  text, 
  timestamp, 
  boolean, 
  integer,
  json
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const users = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password"),
  role: text("role", { enum: ["user", "admin"] }).default("user").notNull(),
  isEmailVerified: boolean("is_email_verified").default(false).notNull(),
  lastLoginAt: timestamp("last_login_at"),
  failedLoginAttempts: integer("failed_login_attempts").default(0).notNull(),
  lockUntil: timestamp("lock_until"),
  avatar: json("avatar"), // { public_id: string, url: string, size: number }
  
  provider: text("provider", { enum: ["local", "google", "github", "facebook"] }).default("local").notNull(),
  providerId: text("provider_id"),
  
  isDeleted: boolean("is_deleted").default(false).notNull(),
  deletedAt: timestamp("deleted_at"),
  reActivateAvailableAt: timestamp("re_activate_available_at"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
