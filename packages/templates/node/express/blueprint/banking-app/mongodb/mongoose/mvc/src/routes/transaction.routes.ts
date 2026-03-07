import { Router } from "express";
import { verifyAuthentication } from "../middlewares/verify-auth";
import { checkUserAccountRestriction } from "../middlewares/user-account-restriction";
import { validateRequest } from "../middlewares/validate-request";
import {
  createSystemInitialTransaction,
  createTransaction,
  getTransactionHistory
} from "../controllers/transaction.controller";
import { createTransactionSchema } from "../validators/transaction";
import { verifySystemUser } from "../middlewares/verify-system-user";
import { validateObjectId } from "../middlewares/validate-id";

const router = Router();

router.post(
  "/system-init",
  verifyAuthentication,
  verifySystemUser,
  checkUserAccountRestriction,
  validateRequest(createTransactionSchema),
  createSystemInitialTransaction
);

router.post(
  "/",
  verifyAuthentication,
  checkUserAccountRestriction,
  validateRequest(createTransactionSchema),
  createTransaction
);

router.get(
  "/history/:accountId",
  verifyAuthentication,
  checkUserAccountRestriction,
  validateObjectId("accountId"),
  getTransactionHistory
);

export default router;
