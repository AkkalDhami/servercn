import { Schema, model, Types } from "mongoose";
import { LedgerEntryType } from "../account/account.types";
import { LEDGER_ENTRY_TYPES } from "../account/account.constants";

export interface ILedger {
  _id: Types.ObjectId;

  accountId: Types.ObjectId;
  transactionId: Types.ObjectId;
  entryType: LedgerEntryType;
  amount: number;

  createdAt: Date;
  updatedAt: Date;
}

const LedgerSchema = new Schema<ILedger>(
  {
    accountId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      index: true,
      immutable: true
    },
    transactionId: {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
      index: true,
      immutable: true
    },
    entryType: {
      type: String,
      enum: LEDGER_ENTRY_TYPES,
      required: true,
      immutable: true
    },
    amount: {
      type: Number,
      required: true,
      immutable: true
    }
  },
  { timestamps: true }
);

function preventLedgerUpdate() {
  throw new Error("Ledger cannot be updated");
}

//? Pre hooks to prevent ledger update
LedgerSchema.pre("findOneAndDelete", preventLedgerUpdate);
LedgerSchema.pre("findOneAndReplace", preventLedgerUpdate);
LedgerSchema.pre("findOneAndUpdate", preventLedgerUpdate);
LedgerSchema.pre("updateOne", preventLedgerUpdate);
LedgerSchema.pre("updateMany", preventLedgerUpdate);
LedgerSchema.pre("deleteMany", preventLedgerUpdate);
LedgerSchema.pre("deleteOne", preventLedgerUpdate);

export const Ledger = model<ILedger>("Ledger", LedgerSchema);
