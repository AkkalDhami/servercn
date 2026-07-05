import db from "@/shared/configs/db";
import { users } from "@/db/schemas/user.schema";
import { ApiError } from "@/shared/utils/api-error";
import { authService, AuthService } from "../auth/auth.service";
import { CookieOptionsType, ProviderType } from "../auth/auth.types";
import { authRepository, AuthRepository } from "../auth/auth.repository";

type OAuthProfile = {
  provider: ProviderType;
  providerId: string;
  name: string;
  email: string | undefined;
  isEmailVerified: boolean;
  avatar: string | undefined;
  ip: string;
  userAgent: string;
};

export class OAuthService {
  constructor(
    private authService: AuthService,
    private repo: AuthRepository
  ) {}

  async handleOAuthLogin(user: OAuthProfile, context: CookieOptionsType) {
    if (!user.email) {
      throw new Error("Email is required for OAuth login");
    }

    const existingUser = await this.repo.findUserByEmail(user.email);

    if (existingUser) {
      const canAutoLinkProvider =
        user.isEmailVerified || existingUser.provider === user.provider;

      if (!canAutoLinkProvider) {
        throw ApiError.forbidden(
          "Please sign in with your existing provider to link this account."
        );
      }

      await this.repo.updateUser(
        {
          provider: user.provider,
          providerId: user.providerId,
          isEmailVerified: existingUser.isEmailVerified || user.isEmailVerified,
          avatar: user.avatar ? { url: user.avatar } : null
        },
        existingUser.id
      );
      await this.authService.handleToken(
        {
          _id: existingUser.id,
          role: existingUser.role,
          ip: user.ip,
          userAgent: user.userAgent
        },
        context
      );
      return existingUser;
    }

    const result = await this.repo.createNewUser({
      name: user.name,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      provider: user.provider,
      providerId: user.providerId,
      password: "",
      role: "user",
      avatar: user.avatar ? { url: user.avatar } : undefined
    });

    await this.authService.handleToken(
      {
        _id: result.id,
        role: "user",
        ip: user.ip,
        userAgent: user.userAgent
      },
      context
    );

    const newUser = await this.repo.findUserById(result.id);

    if (!newUser) {
      throw ApiError.server("Failed to login");
    }

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      avatar: newUser.avatar,
      isEmailVerified: newUser.isEmailVerified,
      provider: newUser.provider,
      lastLoginAt: new Date()
    };
  }
}

export const oauthService = new OAuthService(authService, authRepository);
