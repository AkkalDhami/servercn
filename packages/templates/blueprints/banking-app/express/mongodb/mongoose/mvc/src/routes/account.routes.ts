import { Router } from "express";
import { verifyAuthentication } from "../middlewares/verify-auth";
import {
  createAccount,
  getAccountBalance,
  getAccountDetails,
  getAllAccounts
} from "../controllers/account.controller";
import { checkUserAccountRestriction } from "../middlewares/user-account-restriction";
import { validateRequest } from "../middlewares/validate-request";
import { CreateAccountSchema } from "../validators/account";
import { validateObjectId } from "../middlewares/validate-id";

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
