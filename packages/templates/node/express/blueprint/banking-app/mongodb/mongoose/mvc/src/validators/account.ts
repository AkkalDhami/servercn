import z from "zod";
import {
  ACCOUNT_CURRENCIES,
  ACCOUNT_STATUS,
  ACCOUNT_TYPES
} from "../constants/account";

export const CreateAccountSchema = z.object({
  type: z.enum(ACCOUNT_TYPES, {
    message: "Invalid account type"
  }),
  currency: z
    .enum(ACCOUNT_CURRENCIES, {
      message: "Invalid account currency"
    })
    .default("NPR"),
  status: z
    .enum(ACCOUNT_STATUS, {
      message: "Invalid account status"
    })
    .default("active")
});

export type CreateAccountType = z.infer<typeof CreateAccountSchema>;
