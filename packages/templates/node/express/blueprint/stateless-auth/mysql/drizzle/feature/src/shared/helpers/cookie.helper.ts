import { Response } from "express";
import {
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY
} from "../../modules/auth/auth.constants";
import env from "../configs/env";

const isProduction = env.NODE_ENV === "production";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? ("none" as const) : ("lax" as const),
  path: "/"
};

export function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string
) {
  setCookies(res, [
    {
      cookie: "accessToken",
      value: accessToken,
      maxAge: ACCESS_TOKEN_EXPIRY
    },
    {
      cookie: "refreshToken",
      value: refreshToken,
      maxAge: REFRESH_TOKEN_EXPIRY
    }
  ]);
}

export function clearAuthCookies(res: Response) {
  res.clearCookie("accessToken", COOKIE_OPTIONS);
  res.clearCookie("refreshToken", COOKIE_OPTIONS);
}

export function clearCookie(res: Response, cookie: string = "sid") {
  res.clearCookie(cookie, COOKIE_OPTIONS);
}

type Cookie = {
  cookie: string;
  value: string;
  maxAge: number;
};

export function setCookies(res: Response, cookies: Cookie[]) {
  cookies.forEach(({ cookie, value, maxAge }) => {
    res.cookie(cookie, value, {
      ...COOKIE_OPTIONS,
      maxAge
    });
  });
}
