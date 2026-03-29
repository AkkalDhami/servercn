import { Router } from "express";
import passport from "passport";
import { githubOAuth, facebookOAuth } from "../controllers/oauth.controller";

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
export default router;
