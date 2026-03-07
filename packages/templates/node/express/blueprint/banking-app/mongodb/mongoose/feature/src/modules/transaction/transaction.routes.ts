import { checkUserAccountRestriction } from "@/shared/middlewares/user-account-restriction";
import { verifyAuthentication } from "@/shared/middlewares/verify-auth";
import { Router } from "express";
import { createTransactionSchema } from "./transaction.validator";
import {
  createSystemInitialTransaction,
  createTransaction,
  getTransactionHistory
} from "./transaction.controller";
import { validateRequest } from "@/shared/middlewares/validate-request";
import { validateObjectId } from "@/shared/middlewares/validate-id";
import { verifySystemUser } from "@/shared/middlewares/verify-system-user";

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
