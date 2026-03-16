import { Schema, model, Types } from "mongoose";
import {
  ACCOUNT_CURRENCIES,
  ACCOUNT_STATUS,
  ACCOUNT_TYPES
} from "../constants/account";
import { AccountCurrency, AccountStatus, AccountType } from "../types/account";

export interface IAccount {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  type: AccountType;
  currency: AccountCurrency;
  status: AccountStatus;

  systemAccount: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const AccountSchema = new Schema<IAccount>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: ACCOUNT_TYPES,
      required: true
    },
    currency: {
      type: String,
      enum: ACCOUNT_CURRENCIES,
      default: "NPR"
    },
    status: {
      type: String,
      enum: ACCOUNT_STATUS,
      default: "active",
      index: true
    },
    systemAccount: {
      type: Boolean,
      default: false,
      select: false,
      immutable: true
    }
  },
  { timestamps: true }
);

const Account = model<IAccount>("Account", AccountSchema);

export default Account;
