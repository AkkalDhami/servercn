import { Router } from "express";
import OAuthRoutes from "../modules/oauth/google-oauth.routes";

const router = Router();

router.use("/auth", OAuthRoutes);

export default router;
