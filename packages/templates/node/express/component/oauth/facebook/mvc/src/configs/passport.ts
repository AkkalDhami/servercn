import passport from "passport";
import {
  Strategy as FacebookStrategy,
  Profile as FacebookProfile
} from "passport-facebook";
import env from "./env";

//? FACEBOOK STRATEGY
passport.use(
  new FacebookStrategy(
    {
      clientID: env.FACEBOOK_APP_ID,
      clientSecret: env.FACEBOOK_APP_SECRET,
      callbackURL: env.FACEBOOK_REDIRECT_URI
    },
    function (accessToken, refreshToken, profile: FacebookProfile, cb) {
      // console.log({ profile });
      return cb(null, profile);
    }
  )
);
