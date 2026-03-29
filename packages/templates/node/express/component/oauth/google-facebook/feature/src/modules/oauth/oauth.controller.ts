import { NextFunction, Request, Response } from "express";
import { Profile as FacebookProfile } from "passport-facebook";
import { Profile as GoogleProfile } from "passport-google-oauth20";

import { ApiResponse } from "../../shared/utils/api-response";
import { AsyncHandler } from "../../shared/utils/async-handler";
import { ApiError } from "../../shared/utils/api-error";

//? login with facebook
export const facebookOAuth = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.user as FacebookProfile | undefined;

    if (!data) {
      return next(ApiError.unauthorized("Authenticated failed!"));
    }

    const userInfo = {
      provider: data?.provider,
      providerId: data.id,
      name: data.displayName,
      email: data?.emails && data?.emails[0]?.value,
      isEmailVerified: true,
      avatar: data.profileUrl || (data.photos && data.photos[0].value)
    };

    ApiResponse.ok(res, "Signin Successfull", {
      user: userInfo
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

    const userInfo = {
      provider: data?.provider,
      providerId: data.id,
      name: data.displayName,
      email: data?.emails && data?.emails[0]?.value,
      isEmailVerified: data?.emails && data?.emails[0]?.verified,
      avatar: data.profileUrl || (data.photos && data.photos[0].value)
    };

    //? save the data into your databases

    ApiResponse.ok(res, "Auth Successfull", {
      user: userInfo
    });
  }
);
