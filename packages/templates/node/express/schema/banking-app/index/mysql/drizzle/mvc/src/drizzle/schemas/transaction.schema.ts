import {
  mysqlTable,
  varchar,
  int,
  mysqlEnum,
  index,
  uniqueIndex,
  decimal
} from "drizzle-orm/mysql-core";
import { timestamps } from "./schema.helper";
import { accounts } from "./account.schema";

// Transaction status
export const TRANSACTION_STATUS = [
  "pending",
  "completed",
  "failed",
  "reversed"
] as const;
export type TransactionStatus = (typeof TRANSACTION_STATUS)[number];

export const transactions = mysqlTable(
  "transactions",
  {
    id: int("id").primaryKey().autoincrement(),
    fromAccountId: int("from_account_id")
      .references(() => accounts.id)
      .notNull(),
    toAccountId: int("to_account_id")
      .references(() => accounts.id)
      .notNull(),
    amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
    status: mysqlEnum("status", TRANSACTION_STATUS)
      .default("pending")
      .notNull(),
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
