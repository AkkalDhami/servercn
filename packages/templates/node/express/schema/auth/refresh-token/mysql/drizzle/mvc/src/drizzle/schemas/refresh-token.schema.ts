import {
  mysqlTable,
  varchar,
  boolean,
  timestamp,
  index,
  text,
  int
} from "drizzle-orm/mysql-core";
import { users } from "./user.schema";
import { relations } from "drizzle-orm";

export const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull()
};

export const refreshTokens = mysqlTable(
  "refresh_tokens",
  {
    id: int("id").primaryKey().autoincrement(),
    userId: int("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    isRevoked: boolean("is_revoked").default(false).notNull(),
    revokedAt: timestamp("revoked_at"),
    replacedByTokenHash: varchar("replaced_by_token_hash", { length: 255 }),
    ...timestamps
  },
  table => [
    index("user_id_idx").on(table.userId),
    index("token_hash_idx").on(table.tokenHash),
    index("is_revoked_idx").on(table.isRevoked),
    index("expires_at_idx").on(table.expiresAt)
  ]
);

//? Relations between user and refresh tokens.
//? Many refresh tokens can be associated with one user.
//? (Many-to-One)

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, {
    fields: [refreshTokens.userId],
    references: [users.id]
  })
}));

//? Refresh Token type
export type RefreshToken = typeof refreshTokens.$inferSelect;
export type NewRefreshToken = typeof refreshTokens.$inferInsert;
