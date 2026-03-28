/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import {
  Strategy as GitHubStrategy,
  Profile as GithubProfile
} from "passport-github2";

import {
  Strategy as GoogleStrategy,
  Profile as GoogleProfile
} from "passport-google-oauth20";

import {
  Strategy as FacebookStrategy,
  Profile as FacebookProfile
} from "passport-facebook"; // npm i --save-dev @types/passport-facebook

import env from "./env";

//? GITHUB STRATEGY
passport.use(
  new GitHubStrategy(
    {
      clientID: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      callbackURL: env.GITHUB_REDIRECT_URI
    },
    function (
      accessToken: string,
      refreshToken: string,
      profile: GithubProfile,
      cb: (error: Error | null, user?: any) => void
    ) {
      // console.log({ profile });
      return cb(null, profile);
    }
  )
);

//? GOOGLE STRATEGY
passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: env.GOOGLE_REDIRECT_URI
    },
    function (accessToken, refreshToken, profile: GoogleProfile, cb) {
      return cb(null, profile);
    }
  )
);

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
