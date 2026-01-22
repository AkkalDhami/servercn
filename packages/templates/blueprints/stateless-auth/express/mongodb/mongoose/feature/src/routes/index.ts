import { Router } from "express";
import healthRoutes from "../modules/health/health.routes";
import authRoutes from "../modules/auth/auth.routes";
import oauthRoutes from "../modules/oauth/oauth.routes";

const router = Router();

router.use("/v1/health", healthRoutes);
router.use("/v1/auth", authRoutes);
router.use("/auth", oauthRoutes); //* Here versioning is not given because, in google and github callback routes, we are not using versioning. process.env.GOOGLE_REDIRECT_URI

export default router;
