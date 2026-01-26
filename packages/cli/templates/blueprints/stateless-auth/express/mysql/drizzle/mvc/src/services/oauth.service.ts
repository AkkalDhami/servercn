import { eq } from "drizzle-orm";
import db from "../configs/db";
import { NewUser, users } from "../drizzle";
import { AuthService, CookieOptionsType } from "./auth.service";
import { ApiError } from "../utils/api-error";

export class OAuthService {
  static async handleOAuthLogin(user: NewUser, context: CookieOptionsType) {
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, user.email));
    if (!existingUser) {
      throw ApiError.unauthorized("Unauthorized, please login first");
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
