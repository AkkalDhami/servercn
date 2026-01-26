import { Router } from "express";
import OAuthRoutes from "../modules/oauth/github-oauth.routes";

const router = Router();

router.use("/auth", OAuthRoutes);

export default router;
