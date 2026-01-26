import { NextFunction, Request, Response } from "express";
import { Profile as GithubProfile } from "passport-github2";

import { Profile as GoogleProfile } from "passport-google-oauth20";

import { ApiResponse } from "../utils/api-response";
import { AsyncHandler } from "../utils/async-handler";
import { ApiError } from "../utils/api-error";
import { OAuthService } from "../services/oauth.service";
import { setAuthCookies } from "../helpers/cookie.helper";

//? LOGIN WITH GITHUB
export const githubOAuth = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.user as GithubProfile | undefined;

    if (!data) {
      return next(ApiError.unauthorized("Authenticated failed!"));
    }

    const user = {
      provider: data?.provider,
      providerId: data.id,
      name: data.displayName,
      email: data?.emails && data?.emails[0]?.value,
      isEmailVerified: true,
      avatar: data.photos && data.photos[0].value
    };

    const existingUser = await OAuthService.handleOAuthLogin(user, {
      setAuthCookie: (accessToken: string, refreshToken: string) => {
        setAuthCookies(res, accessToken, refreshToken);
      }
    });

    ApiResponse.ok(res, "Signin Successfull", {
      user: {
        _id: existingUser._id.toString(),
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
        avatar: existingUser.avatar,
        isEmailVerified: existingUser.isEmailVerified,
        lastLoginAt: existingUser.lastLoginAt,
        provider: existingUser.provider
      }
    });
  }
);

//? LOGIN WITH GOOGLE
export const googleOAuth = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.user as GoogleProfile | undefined;

    if (!data) {
      return next(ApiError.unauthorized("Authenticated failed!"));
    }

    const userInfo = {
      provider: data?.provider,
      providerId: data.id,
      name: data.displayName,
      email: data?.emails && data?.emails[0]?.value,
      isEmailVerified:
        (data?.emails && data?.emails[0]?.verified === true) || true,
      avatar: data.profileUrl || (data.photos && data.photos[0].value)
    };

    const existingUser = await OAuthService.handleOAuthLogin(userInfo, {
      setAuthCookie: (accessToken: string, refreshToken: string) => {
        setAuthCookies(res, accessToken, refreshToken);
      }
    });

    ApiResponse.ok(res, "Signin Successfull", {
      user: {
        _id: existingUser._id.toString(),
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
        avatar: existingUser.avatar,
        isEmailVerified: existingUser.isEmailVerified,
        lastLoginAt: existingUser.lastLoginAt,
        provider: existingUser.provider
      }
    });
  }
);
