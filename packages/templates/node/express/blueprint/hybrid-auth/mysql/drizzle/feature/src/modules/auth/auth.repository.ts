import { IAvatar, NewUser, User, users } from "@/db";
import db from "@/shared/configs/db";
import { eq } from "drizzle-orm";
import { SignupUserType } from "./auth.validation";
import {
  ProviderType,
  UpdatePasswordType,
  UpdateUserActivation
} from "./auth.types";
import { REACTIVATION_AVAILABLE_AT } from "./auth.constants";

export class AuthRepository {
  async findUserByEmail(email: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.email, email));

    return user;
  }

  async findUserById(id: number): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async createNewUser(
    user: Omit<SignupUserType, "confirmPassword"> & {
      isEmailVerified?: boolean;
      provider?: ProviderType;
      providerId?: string;
      avatar?: IAvatar;
    }
  ): Promise<{
    id: number;
  }> {
    const [result] = await db
      .insert(users)
      .values({
        name: user.name,
        email: user.email,
        role: user.role,
        password: user.password,
        isEmailVerified: true,
        ...(user.provider && { provider: user.provider }),
        ...(user.avatar && { avatar: user.avatar }),
        ...(user.providerId && { providerId: user.providerId })
      })
      .$returningId();

    return result;
  }

  async updateUser(user: Partial<User>, userId: number) {
    const [result] = await db
      .update(users)
      .set(user)
      .where(eq(users.id, userId));

    return result;
  }

  async updateLoginAttempts({
    failedLoginAttempts,
    lockUntil,
    id
  }: {
    failedLoginAttempts: number;
    lockUntil: Date | null;
    id: number;
  }) {
    await db
      .update(users)
      .set({
        failedLoginAttempts,
        lockUntil
      })
      .where(eq(users.id, id));
  }

  async updatePassword({ email, password }: UpdatePasswordType) {
    await db
      .update(users)
      .set({
        password
      })
      .where(eq(users.email, email));
  }

  async updateUserActivation({
    id,
    deletedAt,
    isDeleted,
    reActivateAvailableAt
  }: UpdateUserActivation) {
    await db
      .update(users)
      .set({
        isDeleted,
        deletedAt,
        reActivateAvailableAt
      })
      .where(eq(users.id, id));
  }
}

export const authRepository = new AuthRepository();
