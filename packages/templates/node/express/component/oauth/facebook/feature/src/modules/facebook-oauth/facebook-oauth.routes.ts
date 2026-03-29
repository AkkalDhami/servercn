import { Router } from "express";
import passport from "passport";

import { facebookOAuth } from "./facebook-oauth.controller";

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
export default router;
