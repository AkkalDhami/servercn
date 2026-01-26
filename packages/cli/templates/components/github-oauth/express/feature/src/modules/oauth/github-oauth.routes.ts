import { Router } from "express";
import passport from "passport";
import { githubOAuth } from "./github-oauth.controller";

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

export default router;
