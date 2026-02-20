import { NextFunction, Response } from "express";
import { AccountService } from "../services/account.service";
import { UserRequest } from "../types/user";
import { ApiResponse } from "../utils/api-response";
import { AsyncHandler } from "../utils/async-handler";
import { CreateAccountType } from "../validators/account";
import { ApiError } from "../utils/api-error";
import { Types } from "mongoose";

//? Create account
export const createAccount = AsyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const data: CreateAccountType = req.body;

    if (!req?.user?._id) {
      return next(ApiError.unauthorized("User not authenticated"));
    }

    const account = await AccountService.createAccount({
      ...data,
      userId: req?.user?._id
    });

    return ApiResponse.created(res, "Account created successfully", {
      account
    });
  }
);

//? Get all accounts
export const getAllAccounts = AsyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    if (!req?.user?._id) {
      return next(ApiError.unauthorized("User not authenticated"));
    }

    const accounts = await AccountService.getAllAccounts(req?.user?._id);

    return ApiResponse.ok(res, "Accounts retrieved successfully", {
      accounts
    });
  }
);

//? Get account balance
export const getAccountBalance = AsyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const accountId = req.params.accountId as string;

    if (!req?.user?._id) {
      return next(ApiError.unauthorized("User not authenticated"));
    }

    const balance = await AccountService.getBalance(
      new Types.ObjectId(accountId)
    );

    return ApiResponse.ok(res, "Account balance retrieved successfully", {
      balance
    });
  }
);

//? Get account details
export const getAccountDetails = AsyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const accountId = req.params.accountId as string;

    if (!req?.user?._id) {
      return next(ApiError.unauthorized("User not authenticated"));
    }

    const account = await AccountService.getAccountDetails(
      accountId,
      req?.user?._id
    );

    return ApiResponse.ok(res, "Account details retrieved successfully", {
      account
    });
  }
);
