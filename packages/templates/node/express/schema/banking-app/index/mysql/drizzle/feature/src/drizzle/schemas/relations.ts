import { relations } from "drizzle-orm";
import { accounts } from "./account.schema";
import { transactions } from "./transaction.schema";
import { ledgers } from "./ledger.schema";
import { users } from "./user.schema";

// User relations
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts)
}));

// Account relations
export const accountsRelations = relations(accounts, ({ one, many }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id]
  }),
  ledgers: many(ledgers)
}));

// Transaction relations
export const transactionsRelations = relations(transactions, ({ many }) => ({
  ledgers: many(ledgers)
}));

// Ledger relations
export const ledgersRelations = relations(ledgers, ({ one }) => ({
  account: one(accounts, {
    fields: [ledgers.accountId],
    references: [accounts.id]
  }),
  transaction: one(transactions, {
    fields: [ledgers.transactionId],
    references: [transactions.id]
  })
}));
