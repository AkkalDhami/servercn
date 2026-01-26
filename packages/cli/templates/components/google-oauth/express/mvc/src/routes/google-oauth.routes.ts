import { Router } from "express";
import passport from "passport";

import { googleOAuth } from "../controllers/google-oauth.controller";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile", "openid"],
    prompt: "consent"
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login", //? redirect route if authenticated is failed
    session: false
  }),
  googleOAuth
);

export default router;
