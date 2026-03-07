import { checkUserAccountRestriction } from "@/shared/middlewares/user-account-restriction";
import { verifyAuthentication } from "@/shared/middlewares/verify-auth";
import { Router } from "express";
import { CreateAccountSchema } from "./account.validator";
import { validateRequest } from "@/shared/middlewares/validate-request";
import {
  createAccount,
  getAccountBalance,
  getAccountDetails,
  getAllAccounts
} from "./account.controller";
import { validateObjectId } from "@/shared/middlewares/validate-id";

const router = Router();

router.post(
  "/",
  verifyAuthentication,
  checkUserAccountRestriction,
  validateRequest(CreateAccountSchema),
  createAccount
);

router.get(
  "/",
  verifyAuthentication,
  checkUserAccountRestriction,
  getAllAccounts
);

router.get(
  "/:accountId",
  verifyAuthentication,
  checkUserAccountRestriction,
  validateObjectId("accountId"),
  getAccountDetails
);

router.get(
  "/balance/:accountId",
  verifyAuthentication,
  checkUserAccountRestriction,
  validateObjectId("accountId"),
  getAccountBalance
);

export default router;
