import { Router } from "express";
import healthRoutes from "../modules/health/health.routes";
import oauthRoutes from "../modules/oauth/oauth.routes";
import authRoutes from "../modules/auth/auth.routes";
import accountRoutes from "../modules/account/account.routes";
import transactionRoutes from "../modules/transaction/transaction.routes";

const router = Router();

router.use("/v1/health", healthRoutes);
router.use("/v1/auth", authRoutes);
router.use("/auth", oauthRoutes);

router.use("/v1/accounts", accountRoutes);
router.use("/v1/transactions", transactionRoutes);

export default router;
