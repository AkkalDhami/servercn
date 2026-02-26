import { Router } from "express";
import healthRoutes from "../modules/health/health.routes";
import oauthRoutes from "../modules/oauth/oauth.routes";
import authRoutes from "../modules/auth/auth.routes";

const router = Router();

router.use("/v1/health", healthRoutes);
router.use("/v1/auth", authRoutes);
router.use("/auth", oauthRoutes);

export default router;
