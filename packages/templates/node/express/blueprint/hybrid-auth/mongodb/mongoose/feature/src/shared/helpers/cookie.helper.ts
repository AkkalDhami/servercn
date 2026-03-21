import { Response } from "express";
import {
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
  SESSION_EXPIRY
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
  refreshToken: string,
  sessionId: string
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
      maxAge: REFRESH_TOKEN_EXPIRY,
      path: "/api/v1/auth/refresh-token"
    },
    {
      cookie: "sid",
      value: sessionId,
      maxAge: SESSION_EXPIRY
    }
  ]);
}

export function clearAuthCookies(res: Response) {
  clearCookie(res, "accessToken");
  clearCookie(res, "refreshToken");
  clearCookie(res, "sid");
}

export function clearCookie(res: Response, cookie: string = "sid") {
  res.clearCookie(cookie, COOKIE_OPTIONS);
}

type Cookie = {
  cookie: string;
  value: string;
  maxAge: number;
  path?: string;
};

export function setCookies(res: Response, cookies: Cookie[]) {
  cookies.forEach(({ cookie, value, maxAge, path = "/" }) => {
    res.cookie(cookie, value, {
      ...COOKIE_OPTIONS,
      path,
      maxAge
    });
  });
}
