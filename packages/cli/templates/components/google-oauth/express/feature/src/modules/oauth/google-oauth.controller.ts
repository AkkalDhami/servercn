import { NextFunction, Request, Response } from "express";
import { Profile } from "passport-google-oauth20";

import { AsyncHandler } from "../../shared/utils/async-handler";
import { ApiError } from "../../shared/errors/api-error";
import { ApiResponse } from "../../shared/utils/api-response";

//? login with google
export const googleOAuth = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.user as Profile | undefined;
    const user = data?._json;

    if (!user || !data) {
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

    const userInfo2 = {
      provider: data?.provider,
      providerId: user.sub,
      name: user.name,
      email: user.email,
      isEmailVerified: user.email_verified,
      avatar: user.picture
    };

    //? save the data into your databases

    ApiResponse.ok(res, "Auth Successfull", {
      userInfo,
      userInfo2
    });
  }
);
