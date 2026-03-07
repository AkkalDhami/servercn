import {
  ACCOUNT_CURRENCIES,
  ACCOUNT_STATUS,
  ACCOUNT_TYPES,
  LEDGER_ENTRY_TYPES,
  TRANSACTION_STATUS
} from "./account.constants";

export type AccountType = (typeof ACCOUNT_TYPES)[number];

export type AccountCurrency = (typeof ACCOUNT_CURRENCIES)[number];

export type AccountStatus = (typeof ACCOUNT_STATUS)[number];

export type TransactionStatus = (typeof TRANSACTION_STATUS)[number];

export type LedgerEntryType = (typeof LEDGER_ENTRY_TYPES)[number];

export interface IAccount {
  _id: string;
  type: string;
  currency: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}
