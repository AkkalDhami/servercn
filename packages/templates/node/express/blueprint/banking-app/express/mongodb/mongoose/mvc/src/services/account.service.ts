import mongoose, { Types } from "mongoose";
import Account from "../models/account.model";
import { Ledger } from "../models/ledger.model";
import { ApiError } from "../utils/api-error";
import { CreateAccountType } from "../validators/account";

export class AccountService {
  static async createAccount(data: CreateAccountType & { userId: string }) {
    const existingAccount = await Account.findOne({
      userId: data.userId,
      type: data.type
    });

    if (existingAccount) {
      throw ApiError.conflict(`Account type:${data.type} already exists`);
    }

    const account = await Account.create(data);
    return {
      _id: account._id,
      type: account.type,
      userId: account.userId,
      status: account.status,
      currency: account.currency
    };
  }

  static async getBalance(accountId: Types.ObjectId) {
    const account = await Account.findById(accountId);
    if (!account) {
      throw ApiError.badRequest("Invalid accountId");
    }

    const balanceData = await Ledger.aggregate([
      {
        $match: {
          accountId
        }
      },
      {
        $group: {
          _id: null,
          totalDebit: {
            $sum: {
              $cond: [
                {
                  $eq: ["$entryType", "debit"]
                },
                "$amount",
                0
              ]
            }
          },
          totalCredit: {
            $sum: {
              $cond: [
                {
                  $eq: ["$entryType", "credit"]
                },
                "$amount",
                0
              ]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          balance: {
            $subtract: ["$totalCredit", "$totalDebit"]
          }
        }
      },
      {
        $project: {
          balance: 1
        }
      }
    ]);

    if (balanceData.length === 0) {
      return 0;
    }

    return balanceData[0].balance;
  }

  static async getAllAccounts(userId: string) {
    const accounts = await Account.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $project: {
          _id: 1,
          type: 1,
          currency: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1
        }
      },

      {
        $lookup: {
          from: "ledgers",
          localField: "_id",
          foreignField: "accountId",
          let: { accountId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$accountId", "$$accountId"] }
              }
            },
            {
              $group: {
                _id: null,
                totalDebit: {
                  $sum: {
                    $cond: [
                      {
                        $eq: ["$entryType", "debit"]
                      },
                      "$amount",
                      0
                    ]
                  }
                },
                totalCredit: {
                  $sum: {
                    $cond: [
                      {
                        $eq: ["$entryType", "credit"]
                      },
                      "$amount",
                      0
                    ]
                  }
                }
              }
            },
            {
              $project: {
                _id: 0,
                balance: {
                  $subtract: ["$totalCredit", "$totalDebit"]
                }
              }
            }
          ],
          as: "ledgers"
        }
      },
      {
        $project: {
          _id: 1,
          type: 1,
          currency: 1,
          status: 1,
          createdAt: 1,
          balance: {
            $ifNull: [{ $first: "$ledgers.balance" }, 0]
          },
          updatedAt: 1
        }
      }
    ]);

    return accounts;
  }

  static async getAccountDetails(accountId: string, userId: string) {
    const [account] = await Account.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(accountId),
          userId: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $project: {
          _id: 1,
          type: 1,
          currency: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1
        }
      },

      {
        $lookup: {
          from: "ledgers",
          localField: "_id",
          foreignField: "accountId",
          let: { accountId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$accountId", "$$accountId"] }
              }
            },
            {
              $group: {
                _id: null,
                totalDebit: {
                  $sum: {
                    $cond: [
                      {
                        $eq: ["$entryType", "debit"]
                      },
                      "$amount",
                      0
                    ]
                  }
                },
                totalCredit: {
                  $sum: {
                    $cond: [
                      {
                        $eq: ["$entryType", "credit"]
                      },
                      "$amount",
                      0
                    ]
                  }
                }
              }
            },
            {
              $project: {
                _id: 0,
                balance: {
                  $subtract: ["$totalCredit", "$totalDebit"]
                }
              }
            }
          ],
          as: "ledgers"
        }
      },
      {
        $project: {
          _id: 1,
          type: 1,
          currency: 1,
          status: 1,
          createdAt: 1,
          balance: {
            $ifNull: [{ $first: "$ledgers.balance" }, 0]
          },
          updatedAt: 1
        }
      }
    ]);

    return account;
  }
}
