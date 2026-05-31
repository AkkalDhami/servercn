import { Account, AuthOptions, Profile as NextAuthProfile } from "next-auth";
import Google from "next-auth/providers/google";

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
      if (account?.provider === "google") {
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
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    
  ],

  secret: process.env.NEXTAUTH_SECRET
};
