import { UserRequest } from "@/@types/global";
import { NextFunction, Response } from "express";
import { ApiError } from "../errors/api-error";
import Account from "@/modules/account/account.model";

export async function verifySystemUser(
  req: UserRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const user = req?.user;

  if (!user || !user?._id) {
    return next(ApiError.unauthorized("Unauthorized"));
  }

  const systemAccount = await Account.findOne({ userId: user._id }).select(
    "+systemAccount"
  );
  if (!systemAccount?.systemAccount) {
    return next(ApiError.forbidden("Forbidden"));
  }
  next();
}
