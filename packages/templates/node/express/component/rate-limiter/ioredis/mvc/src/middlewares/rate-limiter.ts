import type { Request, Response, NextFunction } from "express";
import redis from "../configs/redis";

/**
 * @export
 * @param {number} [limit=100]
 * @param {number} [windowInSeconds=60]
 * @return {*}
 */
export function rateLimiter(limit = 100, windowInSeconds = 60) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = `rate_limit:${req.ip}`;
    const now = Date.now();
    const windowStart = now - windowInSeconds * 1000;

    await redis
      .multi()
      .zremrangebyscore(key, 0, windowStart)
      .zadd(key, now, `${now}-${Math.random()}`)
      .zcard(key)
      .expire(key, windowInSeconds)
      .exec();

    const count = await redis.zcard(key);

    if (count > limit) {
      return res.status(429).json({
        success: false,
        status: 429,
        message: "Too many requests"
      });
    }

    next();
  };
}

/**
  Usage:
 
  import { rateLimiter } from "./middlewares/rate-limiter";
 
 //* global
  app.use(rateLimiter(5, 60));

  //* per route
  app.get("/", rateLimiter(5, 60), (req, res) => {
    res.send("Hello World!");
  });
 
*/
