import {
  pgTable,
  varchar,
  integer,
  pgEnum,
  index,
  uniqueIndex,
  decimal,
  serial
} from "drizzle-orm/pg-core";
import { timestamps } from "./schema.helper";
import { accounts } from "./account.schema";

// Transaction status
export const TRANSACTION_STATUS = [
  "pending",
  "completed",
  "failed",
  "reversed"
] as const;

const statusEnum = pgEnum("status", TRANSACTION_STATUS);

export const transactions = pgTable(
  "transactions",
  {
    id: serial("id").primaryKey().notNull(),
    fromAccountId: serial("from_account_id")
      .references(() => accounts.id)
      .notNull(),
    toAccountId: serial("to_account_id")
      .references(() => accounts.id)
      .notNull(),
    amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
    status: statusEnum("status").default("pending").notNull(),
    idempotencyKey: varchar("idempotency_key", { length: 255 })
      .notNull()
      .unique(),
    ...timestamps
  },
  table => [
    index("from_account_id_idx").on(table.fromAccountId),
    index("to_account_id_idx").on(table.toAccountId),
    index("status_idx").on(table.status),
    uniqueIndex("idempotency_key_idx").on(table.idempotencyKey)
  ]
);

// Transaction types
export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
