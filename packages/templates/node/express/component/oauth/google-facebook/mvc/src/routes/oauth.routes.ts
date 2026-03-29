import { Router } from "express";
import passport from "passport";
import { facebookOAuth, googleOAuth } from "../controllers/oauth.controller";

const router = Router();

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
