import {
  pgTable,
  serial,
  varchar,
  boolean,
  timestamp,
  uniqueIndex,
  pgEnum
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin"]);

const timestamps = {
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" })
    .defaultNow()
    .$onUpdate(() => new Date().toISOString())
    .notNull()
};

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 50 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    role: roleEnum("role").default("user").notNull(),
    isVerified: boolean("is_verified").default(false).notNull(),
    ...timestamps
  },
  table => [uniqueIndex("email_idx").on(table.email)]
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
