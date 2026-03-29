import { Router } from "express";
import OAuthRoutes from "../modules/facebook-oauth/facebook-oauth.routes";

const router = Router();

router.use("/auth", OAuthRoutes);

export default router;
