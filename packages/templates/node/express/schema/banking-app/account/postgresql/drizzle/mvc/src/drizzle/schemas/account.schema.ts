import { pgTable, boolean, index, serial, pgEnum } from "drizzle-orm/pg-core";
import { timestamps } from "./schema.helper";

export const ACCOUNT_TYPES = ["savings", "current"] as const;
export const ACCOUNT_CURRENCIES = ["NPR", "INR", "USD"] as const;
export const ACCOUNT_STATUS = ["active", "frozen", "closed"] as const;

const currencyEnum = pgEnum("currency", ACCOUNT_CURRENCIES);
const accountTypeEnum = pgEnum("type", ACCOUNT_TYPES);
const statusEnum = pgEnum("status", ACCOUNT_STATUS);

export const accounts = pgTable(
  "accounts",
  {
    id: serial("id").primaryKey().notNull(),
    userId: serial("user_id")
      // .references(() => users.id),
      .notNull(),
    currency: currencyEnum("currency").notNull().default("NPR"),
    type: accountTypeEnum("type").notNull().default("savings"),
    status: statusEnum("status").default("active").notNull(),
    systemAccount: boolean("system_account").default(false).notNull(),
    ...timestamps
  },
  table => [
    index("user_id_idx").on(table.userId),
    index("status_idx").on(table.status),
    index("type_idx").on(table.type)
  ]
);

// Account types
export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;
