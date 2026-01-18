import passport from "passport";
import { Strategy as GitHubStrategy, Profile } from "passport-github2";
import env from "./env";

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
      profile: Profile,
      cb: (error: Error | null, user?: any) => void
    ) {
      // console.log({ profile });
      return cb(null, profile);
    }
  )
);
