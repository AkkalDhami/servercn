import { NextFunction, Request, Response } from "express";
import { Profile as FacebookProfile } from "passport-facebook";

import { ApiResponse } from "../utils/api-response";
import { AsyncHandler } from "../utils/async-handler";
import { ApiError } from "../utils/api-error";

//? LOGIN WITH FACEBOOK
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
