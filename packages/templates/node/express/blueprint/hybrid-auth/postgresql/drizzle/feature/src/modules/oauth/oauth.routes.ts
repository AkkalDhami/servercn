import { Router } from "express";
import passport from "passport";
import { facebookOAuth, githubOAuth, googleOAuth } from "./oauth.controller";

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
  "/facebook",
  passport.authenticate("facebook", { scope: ["email", "user_location"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login", //? redirect route if authenticated is failed,
    session: false,
    failureMessage: true
  }),
  facebookOAuth
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
