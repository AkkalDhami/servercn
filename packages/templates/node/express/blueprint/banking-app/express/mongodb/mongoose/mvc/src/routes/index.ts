import { Router } from "express";
import healthRoutes from "./health.routes";
import authRoutes from "./auth.routes";
import oauthRoutes from "./oauth.routes";
import accountRoutes from "./account.routes";
import transactionRoutes from "./transaction.routes";

const router = Router();

router.use("/v1/health", healthRoutes);
router.use("/v1/auth", authRoutes);
router.use("/auth", oauthRoutes);
router.use("/v1/accounts", accountRoutes);
router.use("/v1/transactions", transactionRoutes);

export default router;
