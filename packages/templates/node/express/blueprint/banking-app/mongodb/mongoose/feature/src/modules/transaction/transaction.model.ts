import { Schema, model, Types } from "mongoose";
import { TransactionStatus } from "../account/account.types";
import { TRANSACTION_STATUS } from "../account/account.constants";

export interface ITransaction {
  _id: Types.ObjectId;

  fromAccountId: Types.ObjectId;
  toAccountId: Types.ObjectId;

  amount: number;
  status: TransactionStatus;
  idempotencyKey: string;

  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    fromAccountId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
      index: true
    },
    toAccountId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
      index: true
    },
    amount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: TRANSACTION_STATUS,
      default: "pending"
    },
    idempotencyKey: {
      type: String,
      required: true,
      unique: true,
      index: true
    }
  },
  { timestamps: true }
);

const Transaction = model<ITransaction>("Transaction", TransactionSchema);

export default Transaction;
