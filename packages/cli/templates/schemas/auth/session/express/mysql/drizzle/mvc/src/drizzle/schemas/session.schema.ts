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

const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull()
};

export const sessions = mysqlTable(
  "sessions",
  {
    id: int("id").primaryKey().autoincrement(),
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
    index("isActive_idx").on(table.isActive)
  ]
);

//? Relations between session and users.
//? Many sessions can be associated with one user.
//? (Many-to-One)
export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id]
  })
}));

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
