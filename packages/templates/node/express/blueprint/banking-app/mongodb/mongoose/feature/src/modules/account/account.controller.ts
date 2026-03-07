import { NextFunction, Response } from "express";

import { Types } from "mongoose";
import { CreateAccountType } from "./account.validator";
import { AsyncHandler } from "@/shared/utils/async-handler";
import { AccountService } from "./account.service";
import { ApiError } from "@/shared/errors/api-error";
import { UserRequest } from "@/@types/global";
import { ApiResponse } from "@/shared/utils/api-response";

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
