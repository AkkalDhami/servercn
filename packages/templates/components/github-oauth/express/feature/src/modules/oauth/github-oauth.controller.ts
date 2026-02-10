import { NextFunction, Request, Response } from "express";
import { Profile } from "passport-github2";

import { AsyncHandler } from "../../shared/utils/async-handler";
import { ApiError } from "../../shared/errors/api-error";
import { ApiResponse } from "../../shared/utils/api-response";

//? login with github
export const githubOAuth = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.user as Profile | undefined;

    if (!data) {
      return next(ApiError.unauthorized("Authenticated failed!"));
    }

    // console.log(data);

    const user = {
      provider: data?.provider,
      providerId: data.id,
      name: data.displayName,
      email: data?.emails && data?.emails[0]?.value,
      isEmailVerified: true,
      avatar: data.photos && data.photos[0].value
    };

    //? save the data into your databases

    ApiResponse.ok(res, "Auth Successfull", {
      user
    });
  }
);
