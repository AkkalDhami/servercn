import { Ratelimit } from "@upstash/ratelimit";
import redis from "../configs/redis";
import { NextFunction, Request, Response } from "express";

type RateLimitStrategy = "slidingWindow" | "fixedWindow" | "tokenBucket";

type Duration =
  | `${number} ms`
  | `${number} s`
  | `${number} m`
  | `${number} h`
  | `${number} d`;

type CreateRateLimitOptions = {
  limit?: number;
  duration?: Duration;
  strategy?: RateLimitStrategy;
  analytics?: boolean;
  prefix?: string;
  message?: string;
};

/**
 * @export
 * @param {CreateRateLimitOptions} {
 *   limit = 100,
 *   duration = "1 m",
 *   strategy = "slidingWindow",
 *   analytics = false,
 *   prefix = "@servercn/ratelimit",
 *   message = "Too many requests. Please try again later."
 * }
 * @return {*}  {*}
 */
export function rateLimiter({
  limit = 100,
  duration = "1 m",
  strategy = "slidingWindow",
  analytics = false,
  prefix = "@servercn/ratelimit",
  message = "Too many requests. Please try again later."
}: CreateRateLimitOptions): any {
  let limiter;

  switch (strategy) {
    case "fixedWindow":
      limiter = Ratelimit.fixedWindow(limit, duration);
      break;

    case "tokenBucket":
      limiter = Ratelimit.tokenBucket(limit, duration, limit);
      break;

    case "slidingWindow":
    default:
      limiter = Ratelimit.slidingWindow(limit, duration);
  }

  limiter = new Ratelimit({
    redis,
    limiter,
    analytics,
    prefix
  });

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ip =
        req.ip || req.headers["x-forwarded-for"]?.toString() || "anonymous";

      const { success, limit, remaining, reset } = await limiter.limit(ip);

      res.setHeader("X-RateLimit-Limit", limit);
      res.setHeader("X-RateLimit-Remaining", remaining);
      res.setHeader("X-RateLimit-Reset", reset);

      if (!success) {
        return res.status(429).json({
          success: false,
          message,
          status: 429
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

/*
? 1. Global Rate Limit
import express from "express";

const app = express();

app.use(
  rateLimiter({
    limit: 100,
    duration: "1 m",
    prefix: "@servercn/global"
  })
);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

? 2. Route-Specific Rate Limit

router.post(
  "/login",
  rateLimiter({
    limit: 10,
    duration: "1 m",
    strategy: "fixedWindow",
    prefix: "@servercn/login",
    message: "Too many login attempts."
  }),
  loginController
);
*/
