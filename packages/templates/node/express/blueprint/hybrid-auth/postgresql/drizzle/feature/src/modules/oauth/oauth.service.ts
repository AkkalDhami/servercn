import { AuthService, CookieOptionsType } from "../auth/auth.service";
import db from "../../shared/configs/db";
import { users } from "../../drizzle/schemas/user.schema";
import { eq } from "drizzle-orm";

type OAuthProfile = {
  provider: "local" | "google" | "github" | "facebook";
  providerId: string;
  name: string;
  email: string | undefined;
  isEmailVerified: boolean;
  avatar: string | undefined;
  ip: string;
  userAgent: string;
};

export class OAuthService {
  static async handleOAuthLogin(
    user: OAuthProfile,
    context: CookieOptionsType
  ) {
    if (!user.email) {
      throw new Error("Email is required for OAuth login");
    }

    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, user.email)
    });

    if (existingUser) {
      const [updatedUser] = await db.update(users).set({
        provider: user.provider,
        providerId: user.providerId,
        isEmailVerified: user.isEmailVerified,
        avatar: user.avatar ? { url: user.avatar } : null
      }).where(eq(users.id, existingUser.id)).returning();

      await AuthService.handleToken(
        {
          _id: updatedUser.id,
          role: updatedUser.role as "user" | "admin",
          ip: user.ip,
          userAgent: user.userAgent
        },
        context
      );
      return updatedUser;
    }

    const [newUser] = await db.insert(users).values({
      name: user.name,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      provider: user.provider,
      providerId: user.providerId,
      avatar: user.avatar ? { url: user.avatar } : null
    }).returning();

    await AuthService.handleToken(
      {
        _id: newUser.id,
        role: newUser.role as "user" | "admin",
        ip: user.ip,
        userAgent: user.userAgent
      },
      context
    );

    return newUser;
  }
}
