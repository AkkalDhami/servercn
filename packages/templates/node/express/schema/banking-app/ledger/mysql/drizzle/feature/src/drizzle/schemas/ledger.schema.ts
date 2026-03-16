import {
  mysqlTable,
  int,
  mysqlEnum,
  index,
  decimal
} from "drizzle-orm/mysql-core";
import { timestamps } from "./schema.helper";
import { accounts } from "./account.schema";
import { transactions } from "./transaction.schema";

// Ledger entry types
export const LEDGER_ENTRY_TYPES = ["debit", "credit"] as const;
export type LedgerEntryType = (typeof LEDGER_ENTRY_TYPES)[number];

export const ledgers = mysqlTable(
  "ledgers",
  {
    id: int("id").primaryKey().autoincrement(),
    accountId: int("account_id")
      .references(() => accounts.id)
      .notNull(),
    transactionId: int("transaction_id")
      .references(() => transactions.id)
      .notNull(),
    entryType: mysqlEnum("entry_type", LEDGER_ENTRY_TYPES).notNull(),
    amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
    ...timestamps
  },
  table => [
    index("account_id_idx").on(table.accountId),
    index("transaction_id_idx").on(table.transactionId),
    index("entry_type_idx").on(table.entryType)
  ]
);

// Ledger types
export type Ledger = typeof ledgers.$inferSelect;
export type NewLedger = typeof ledgers.$inferInsert;
