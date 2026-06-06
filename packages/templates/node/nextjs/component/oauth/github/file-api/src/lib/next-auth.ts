import { Account, AuthOptions, Profile as NextAuthProfile } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

interface CustomProfile extends NextAuthProfile {
  picture?: string;
  avatar_url?: string;
  email_verified?: boolean;
}

export const authOptions: AuthOptions = {
  callbacks: {
    async signIn({
      account,
      profile
    }: {
      account: Account | null;
      profile?: CustomProfile | undefined;
    }) {
      if (!account || !profile) return false;
      if (account?.provider === "github") {
        // console.log({ profile, account });

        const userInfo = {
          name: profile?.name as string,
          email: profile?.email as string,
          avatar: profile.picture || profile.avatar_url,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          isEmailVerified: profile?.email_verified ?? false
        };

        console.log({ userInfo });

        return true;
      }
      return true;
    }
  },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      authorization: {
        params: {
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],

  secret: process.env.NEXTAUTH_SECRET
};
