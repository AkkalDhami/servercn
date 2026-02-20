import { AccountService } from "./account.service";
import Account from "../models/account.model";
import Transaction, { ITransaction } from "../models/transaction.model";
import { ApiError } from "../utils/api-error";
import { CreateTransactionType } from "../validators/transaction";
import mongoose, { Types } from "mongoose";
import { Ledger } from "../models/ledger.model";
import { sendEmail } from "../utils/send-mail";
import { AuthService } from "./auth.service";
import { UserProfile } from "../types/user";
import { IPagination } from "../types/account";

export class TranscationService {
  static async createTransaction(
    data: CreateTransactionType & { currentUserId: string }
  ) {
    //? check if from and to account id are exist
    const [fromAccount] = await Account.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(data.fromAccountId)
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userId",
          pipeline: [
            {
              $project: {
                email: 1,
                _id: 1
              }
            }
          ]
        }
      },
      {
        $unwind: "$userId"
      }
    ]);
    const [toAccount] = await Account.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(data.toAccountId)
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userId",
          pipeline: [
            {
              $project: {
                email: 1,
                _id: 1
              }
            }
          ]
        }
      },
      {
        $unwind: "$userId"
      }
    ]);

    if (!fromAccount) {
      throw ApiError.badRequest("Invalid from accountId");
    }
    if (!toAccount) {
      throw ApiError.badRequest("Invalid to accountId");
    }

    //? check if current user is authorized to perform this transaction

    const currentUserAccount: UserProfile = await AuthService.getUserProfile(
      data.currentUserId
    );

    if (
      !currentUserAccount ||
      !currentUserAccount.accounts ||
      currentUserAccount.accounts?.length === 0
    ) {
      throw ApiError.unauthorized("Unauthorized access");
    }

    const isAuthorized: boolean = currentUserAccount?.accounts.some(
      acc => acc._id.toString() === fromAccount._id.toString()
    );

    if (!isAuthorized) {
      throw ApiError.unauthorized("Unauthorized access");
    }

    if (fromAccount._id.equals(toAccount._id)) {
      throw ApiError.badRequest("Cannot transfer to the same account");
    }

    //? check idempotencyKey already exist
    const transactionExist = await Transaction.findOne({
      idempotencyKey: data.idempotencyKey
    });

    if (transactionExist) {
      if (transactionExist.status === "completed") {
        throw ApiError.badRequest("Transaction already completed");
      }

      if (transactionExist.status === "pending") {
        throw ApiError.badRequest("Transaction is still pending");
      }

      if (transactionExist.status === "failed") {
        throw ApiError.badRequest("Transaction failed, please try again");
      }
    }

    //? check both account status
    if (fromAccount.status !== "active") {
      throw ApiError.badRequest("From account is not active");
    }
    if (toAccount.status !== "active") {
      throw ApiError.badRequest("To account is not active");
    }

    //? check if from account have sufficient balance
    const balance = await AccountService.getBalance(fromAccount._id);
    if (balance < data.amount) {
      throw ApiError.badRequest("Insufficient balance");
    }

    //? create transaction
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const [transaction] = await Transaction.create(
        [
          {
            ...data,
            status: "pending"
          }
        ],
        { session }
      );
      if (!transaction) {
        await session.abortTransaction();
        throw ApiError.badRequest("Transaction creation failed");
      }

      const debitEntry = await Ledger.create(
        [
          {
            accountId: fromAccount._id,
            transactionId: transaction._id,
            amount: data.amount,
            entryType: "debit"
          }
        ],
        { session }
      );

      const creditEntry = await Ledger.create(
        [
          {
            accountId: toAccount._id,
            transactionId: transaction._id,
            amount: data.amount,
            entryType: "credit"
          }
        ],
        { session }
      );

      if (!debitEntry || !creditEntry) {
        await session.abortTransaction();
        throw ApiError.badRequest("Ledger entry creation failed");
      }

      //? update transaction status to completed
      await Transaction.findByIdAndUpdate(
        transaction._id,
        { status: "completed" },
        { session }
      );

      //? send email notification to both account owner
      Promise.all([
        sendEmail({
          email: fromAccount.userId?.email || "",
          subject: "Transaction Notification",
          html: `Your transaction of NPR ${data.amount.toLocaleString()} to account ${toAccount._id} has been processed.`
        }),
        sendEmail({
          email: toAccount.userId?.email || "",
          subject: "Transaction Notification",
          html: `You received a transaction of NPR ${data.amount.toLocaleString()} from account ${fromAccount._id}.`
        })
      ]);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

    await session.commitTransaction();
    return;
  }

  static async createInitialTransaction(
    data: CreateTransactionType
  ): Promise<void> {
    const [toAccount] = await Account.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(data.toAccountId)
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userId",
          pipeline: [{ $project: { email: 1 } }]
        }
      },
      { $unwind: "$userId" }
    ]);

    if (!toAccount) {
      throw ApiError.badRequest("Invalid to accountId");
    }

    const [fromAccount] = await Account.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(data.fromAccountId),
          systemAccount: true
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userId",
          pipeline: [{ $project: { email: 1 } }]
        }
      },
      { $unwind: "$userId" }
    ]);

    if (!fromAccount) {
      throw ApiError.badRequest("Invalid system account");
    }

    if (fromAccount._id.equals(toAccount._id)) {
      throw ApiError.badRequest("Cannot transfer to the same account");
    }

    //? check fromAccount is active
    if (fromAccount.status !== "active") {
      throw ApiError.badRequest("From account is not active");
    }

    //? check toAccount is active
    if (toAccount.status !== "active") {
      throw ApiError.badRequest("To account is not active");
    }

    //? check idempotencyKey already exist
    const transactionExist = await Transaction.findOne({
      idempotencyKey: data.idempotencyKey
    });

    if (transactionExist) {
      if (transactionExist.status === "completed") {
        throw ApiError.badRequest("Transaction already completed");
      }

      if (transactionExist.status === "pending") {
        throw ApiError.badRequest("Transaction is still pending");
      }

      if (transactionExist.status === "failed") {
        throw ApiError.badRequest("Transaction failed, please try again");
      }
    }

    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      // Create transaction
      const [transaction] = await Transaction.create(
        [
          {
            fromAccountId: fromAccount._id,
            toAccountId: toAccount._id,
            amount: data.amount,
            idempotencyKey: data.idempotencyKey,
            status: "pending"
          }
        ],
        { session }
      );
      if (!transaction) {
        await session.abortTransaction();
        throw ApiError.badRequest("Transaction creation failed");
      }

      // Create ledger entries (double-entry)
      const entries = await Ledger.insertMany(
        [
          {
            accountId: fromAccount._id,
            transactionId: transaction._id,
            amount: data.amount,
            entryType: "debit"
          },
          {
            accountId: toAccount._id,
            transactionId: transaction._id,
            amount: data.amount,
            entryType: "credit"
          }
        ],
        { session }
      );

      if (!entries) {
        await session.abortTransaction();
        throw ApiError.badRequest("Ledger entry creation failed");
      }

      // Mark transaction as completed
      transaction.status = "completed";
      await transaction.save({ session });

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  static async getTransactionHistory({
    currentUserId,
    accountId,
    page,
    limit,
    fromDate,
    toDate
  }: {
    currentUserId: string;
    accountId: string;
    fromDate?: string;
    toDate?: string;
    page: number;
    limit: number;
  }): Promise<{ history: ITransaction[]; pagination: IPagination }> {
    const currentUserAccount: UserProfile =
      await AuthService.getUserProfile(currentUserId);

    if (
      !currentUserAccount ||
      !currentUserAccount.accounts ||
      currentUserAccount.accounts?.length === 0
    ) {
      throw ApiError.unauthorized("Unauthorized access");
    }

    const isAuthorized: boolean = currentUserAccount?.accounts.some(
      acc => acc._id.toString() === accountId.toString()
    );

    if (!isAuthorized) {
      throw ApiError.unauthorized("Unauthorized access");
    }

    const skip = (page - 1) * limit;

    const query: any = {
      $or: [
        { fromAccountId: new Types.ObjectId(accountId) },
        { toAccountId: new Types.ObjectId(accountId) }
      ]
    };

    const from =
      fromDate && !isNaN(new Date(fromDate).getTime())
        ? new Date(fromDate)
        : null;

    const to =
      toDate && !isNaN(new Date(toDate).getTime()) ? new Date(toDate) : null;

    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = from;
      if (to) query.createdAt.$lte = to;
    }

    const history = await Transaction.aggregate([
      { $match: query },

      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "accounts",
          localField: "fromAccountId",
          foreignField: "_id",
          as: "fromAccount",
          pipeline: [{ $project: { _id: 1, type: 1, currency: 1 } }]
        }
      },

      {
        $lookup: {
          from: "accounts",
          localField: "toAccountId",
          foreignField: "_id",
          as: "toAccount",
          pipeline: [{ $project: { _id: 1, type: 1, currency: 1 } }]
        }
      },

      {
        $project: {
          _id: 1,
          fromAccount: { $arrayElemAt: ["$fromAccount", 0] },
          toAccount: { $arrayElemAt: ["$toAccount", 0] },
          amount: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1
        }
      }
    ]);

    const total = await Transaction.countDocuments(query);

    return {
      history,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
}
