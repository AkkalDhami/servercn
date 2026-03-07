import { Router } from "express";
import passport from "passport";
import { githubOAuth, googleOAuth } from "../controllers/oauth.controller";

const router = Router();

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login", //? redirect route if authenticated is failed,
    session: false
  }),
  githubOAuth
);

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
