import {
  mysqlTable,
  boolean,
  timestamp,
  int,
  mysqlEnum,
  index
} from "drizzle-orm/mysql-core";

export const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull()
};

//? Account types
export const ACCOUNT_TYPES = ["savings", "current"] as const;
export type AccountType = (typeof ACCOUNT_TYPES)[number];

//? Account currencies
export const ACCOUNT_CURRENCIES = ["NPR", "INR", "USD"] as const;
export type AccountCurrency = (typeof ACCOUNT_CURRENCIES)[number];

//? Account status
export const ACCOUNT_STATUS = ["active", "frozen", "closed"] as const;
export type AccountStatus = (typeof ACCOUNT_STATUS)[number];

export const accounts = mysqlTable(
  "accounts",
  {
    id: int("id").primaryKey().autoincrement(),
    userId: int("user_id")
      // .references(() => users.id)
      .notNull(),
    type: mysqlEnum("type", ACCOUNT_TYPES).notNull(),
    currency: mysqlEnum("currency", ACCOUNT_CURRENCIES)
      .default("NPR")
      .notNull(),
    status: mysqlEnum("status", ACCOUNT_STATUS).default("active").notNull(),
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
