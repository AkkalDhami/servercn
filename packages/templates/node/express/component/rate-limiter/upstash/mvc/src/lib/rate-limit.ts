import { Ratelimit } from "@upstash/ratelimit";
import redis from "../configs/redis";

//* Global Rate Limit
export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 m"), //* 100 requests per minute
  analytics: true,
  prefix: "@servercn/ratelimit"
});

//* Route-Specific Rate Limits
export const apiLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 m")
});

export const loginLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(10, "60 s") //* 10 requests per minute
});

/**
* ? Usage Example(Route-Specific)
app.post("/login", async (req, res, next) => {
  const { success } = await loginLimiter.limit(req.ip!);

  if (!success) {
    return res.status(429).json({
      success: false,
      status: 429,
      message: "Too many login attempts",
    });
  }

  next();
});

*/
