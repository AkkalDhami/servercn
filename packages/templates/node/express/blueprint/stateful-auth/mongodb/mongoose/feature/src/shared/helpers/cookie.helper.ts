import { Response } from "express";
import env from "../configs/env";

const isProduction = env.NODE_ENV === "production";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? ("none" as const) : ("lax" as const),
  path: "/"
};

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
