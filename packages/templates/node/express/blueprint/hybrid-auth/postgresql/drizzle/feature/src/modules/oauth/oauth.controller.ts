import { NextFunction, Request, Response } from "express";
import { Profile as GithubProfile } from "passport-github2";
import { Profile as GoogleProfile } from "passport-google-oauth20";
import { Profile as FacebookProfile } from "passport-facebook";

import { ApiResponse } from "../../shared/utils/api-response";
import { AsyncHandler } from "../../shared/utils/async-handler";
import { ApiError } from "../../shared/utils/api-error";
import { OAuthService } from "./oauth.service";
import { setAuthCookies } from "../../shared/helpers/cookie.helper";

//? LOGIN WITH GITHUB
export const githubOAuth = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.user as GithubProfile | undefined;

    if (!data) {
      return next(ApiError.unauthorized("Authentication failed"));
    }

    const email = data?.emails?.[0]?.value;

    if (!email?.trim()) {
      return next(ApiError.badRequest("Email is required for OAuth login"));
    }

    const user = {
      provider: data?.provider as "local" | "google" | "github" | "facebook",
      providerId: data.id,
      name: data.displayName,
      email,
      isEmailVerified: false,
      avatar:
        data.photos && data.photos.length > 0
          ? data.photos[0]?.value
          : undefined,
      ip: req.ip || "Unknown",
      userAgent: req.get("user-agent") || req.headers["user-agent"] || "Unknown"
    };

    const existingUser = await OAuthService.handleOAuthLogin(user, {
      setAuthCookie: (
        accessToken: string,
        refreshToken: string,
        sessionId: string
      ) => {
        setAuthCookies(res, accessToken, refreshToken, sessionId);
      }
    });

    //? save the data into your databases

    ApiResponse.ok(res, "Sign in successful", {
      user: {
        id: existingUser.id,
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
      return next(ApiError.unauthorized("Authentication failed"));
    }

    const email = data?.emails?.[0]?.value;

    if (!email?.trim()) {
      return next(ApiError.badRequest("Email is required for OAuth login"));
    }

    const userInfo = {
      provider: data?.provider as "local" | "google" | "github" | "facebook",
      providerId: data.id,
      name: data.displayName,
      email,
      isEmailVerified: data?.emails?.[0]?.verified === true,
      avatar:
        data.photos && data.photos.length > 0
          ? data.photos[0]?.value
          : undefined,
      ip: req.ip || "Unknown",
      userAgent: req.get("user-agent") || req.headers["user-agent"] || "Unknown"
    };

    const existingUser = await OAuthService.handleOAuthLogin(userInfo, {
      setAuthCookie: (
        accessToken: string,
        refreshToken: string,
        sessionId: string
      ) => {
        setAuthCookies(res, accessToken, refreshToken, sessionId);
      }
    });

    ApiResponse.ok(res, "Sign in successful", {
      user: {
        id: existingUser.id,
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

//? LOGIN WITH FACEBOOK
export const facebookOAuth = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.user as FacebookProfile | undefined;

    if (!data) {
      return next(ApiError.unauthorized("Authentication failed"));
    }

    const email = data?.emails?.[0]?.value;

    if (!email?.trim()) {
      return next(ApiError.badRequest("Email is required for OAuth login"));
    }

    const userInfo = {
      provider: data?.provider as "local" | "google" | "github" | "facebook",
      providerId: data.id,
      name: data.displayName,
      email,
      isEmailVerified: false,
      avatar:
        data.profileUrl ||
        (data.photos && data.photos.length > 0
          ? data.photos[0]?.value
          : undefined),
      ip: req.ip || "Unknown",
      userAgent: req.get("user-agent") || req.headers["user-agent"] || "Unknown"
    };

    const existingUser = await OAuthService.handleOAuthLogin(userInfo, {
      setAuthCookie: (
        accessToken: string,
        refreshToken: string,
        sessionId: string
      ) => {
        setAuthCookies(res, accessToken, refreshToken, sessionId);
      }
    });

    ApiResponse.ok(res, "Sign in successful", {
      user: {
        id: existingUser.id,
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
