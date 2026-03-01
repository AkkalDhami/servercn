export const ACCOUNT_TYPES = ["savings", "current"] as const;

export const ACCOUNT_CURRENCIES = ["NPR", "INR", "USD"] as const;

export const ACCOUNT_STATUS = ["active", "frozen", "closed"] as const;

export const TRANSACTION_STATUS = [
  "pending",
  "completed",
  "failed",
  "reversed"
] as const;

export const LEDGER_ENTRY_TYPES = ["debit", "credit"] as const;
