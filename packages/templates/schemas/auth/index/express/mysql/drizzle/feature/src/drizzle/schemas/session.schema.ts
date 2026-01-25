import {
  mysqlTable,
  serial,
  varchar,
  timestamp,
  boolean,
  index,
  int
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { users } from "./user.schema";
import { timestamps } from "./schema.helper";

export const sessions = mysqlTable(
  "sessions",
  {
    id: serial("id").primaryKey(),
    userId: int("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    tokenHash: varchar("token_hash", { length: 255 }).notNull().unique(),
    ip: varchar("ip", { length: 45 }),
    userAgent: varchar("user_agent", { length: 512 }),
    isActive: boolean("is_active").default(true).notNull(),
    lastUsedAt: timestamp("last_used_at").defaultNow().notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    ...timestamps
  },
  table => [
    index("userId_idx").on(table.userId),
    index("tokenHash_idx").on(table.tokenHash),
    index("isActive_idx").on(table.isActive),
    index("userId_isActive_idx").on(table.userId, table.isActive),
    index("userId_lastUsedAt_idx").on(table.userId, table.lastUsedAt)
  ]
);

//? Relations between user and sessions. One user can have many sessions. (One-to-Many)
export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id]
  })
}));

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
