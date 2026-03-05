import {
  pgTable,
  integer,
  pgEnum,
  index,
  decimal,
  serial
} from "drizzle-orm/pg-core";
import { timestamps } from "./schema.helper";

// Ledger entry types
export const LEDGER_ENTRY_TYPES = ["debit", "credit"] as const;

const entryTypeEnum = pgEnum("entry_type", LEDGER_ENTRY_TYPES);

export const ledgers = pgTable(
  "ledgers",
  {
    id: serial("id").primaryKey().notNull(),
    accountId: serial("account_id")
      // .references(() => accounts.id)
      .notNull(),
    transactionId: serial("transaction_id")
      // .references(() => transactions.id)
      .notNull(),
    entryType: entryTypeEnum("entry_type").notNull(),
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
