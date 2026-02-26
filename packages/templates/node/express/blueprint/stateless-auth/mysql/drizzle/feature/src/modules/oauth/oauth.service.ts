import { eq } from "drizzle-orm";
import db from "../../shared/configs/db";
import { NewUser, users } from "../../drizzle";
import { AuthService, CookieOptionsType } from "../auth/auth.service";

export class OAuthService {
  static async handleOAuthLogin(user: NewUser, context: CookieOptionsType) {
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, user.email));
    if (existingUser) {
      await db
        .update(users)
        .set({
          provider: user.provider,
          providerId: user.providerId,
          avatar: {
            url: user.avatar?.url || existingUser.avatar?.url
          }
        })
        .where(eq(users.id, existingUser.id));
      await AuthService.handleUserToken(
        {
          id: existingUser.id,
          role: existingUser.role
        },
        context
      );
      return existingUser;
    }

    const [newUser] = await db
      .insert(users)
      .values({
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        provider: user.provider,
        providerId: user.providerId
      })
      .$returningId();

    await AuthService.handleUserToken(
      {
        id: newUser.id,
        role: "user"
      },
      context
    );

    return newUser;
  }
}
