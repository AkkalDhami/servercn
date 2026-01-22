import { NextFunction, Request, Response } from "express";
import { Profile as GithubProfile } from "passport-github2";

import { Profile as GoogleProfile } from "passport-google-oauth20";

import { ApiResponse } from "../utils/api-response";
import { AsyncHandler } from "../utils/async-handler";
import { ApiError } from "../utils/api-error";
import { setAuthCookies } from "../helpers/cookie.helper";
import { OAuthService } from "../services/oauth.service";
import { NewUser } from "../drizzle";

const getProvider: Record<string, "github" | "google" | "local"> = {
  github: "github",
  google: "google"
};

//? login with github
export const githubOAuth = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.user as GithubProfile | undefined;

    if (!data) {
      return next(ApiError.unauthorized("Authenticated failed!"));
    }

    const user: NewUser = {
      provider: getProvider[data?.provider],
      providerId: data.id,
      name: data.displayName,
      email: data.emails ? (data.emails[0].value as string) : "",
      isEmailVerified: true,
      avatar: {
        url: data.photos ? (data.photos[0].value as string) : ""
      }
    };

    const result = await OAuthService.handleOAuthLogin(user, {
      setAuthCookie: (accessToken: string, refreshToken: string) => {
        setAuthCookies(res, accessToken, refreshToken);
      }
    });

    ApiResponse.ok(res, "Auth Successfull", {
      user: {
        ...user,
        id: result.id
      }
    });
  }
);

//? login with google
export const googleOAuth = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.user as GoogleProfile | undefined;

    if (!data) {
      return next(ApiError.unauthorized("Authenticated failed!"));
    }

    const userInfo: NewUser = {
      provider: getProvider[data?.provider],
      providerId: data.id,
      name: data.displayName,
      email: data?.emails ? (data.emails[0].value as string) : "",
      isEmailVerified: data?.emails
        ? (data.emails[0].verified as boolean)
        : false,
      avatar: {
        url: data.profileUrl || (data.photos ? data.photos[0].value : "")
      }
    };

    const result = await OAuthService.handleOAuthLogin(userInfo, {
      setAuthCookie: (accessToken: string, refreshToken: string) => {
        setAuthCookies(res, accessToken, refreshToken);
      }
    });

    ApiResponse.ok(res, "Auth Successfull", {
      user: {
        ...userInfo,
        id: result.id
      }
    });
  }
);
