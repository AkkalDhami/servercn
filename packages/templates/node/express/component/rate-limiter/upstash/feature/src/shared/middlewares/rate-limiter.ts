import { Request, Response, NextFunction } from "express";
import { ratelimit } from "../lib/rate-limit";

export async function rateLimiter(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const identifier = req.ip ?? "anonymous";

  const { success, limit, remaining, reset } =
    await ratelimit.limit(identifier);

  res.setHeader("X-RateLimit-Limit", limit);
  res.setHeader("X-RateLimit-Remaining", remaining);
  res.setHeader("X-RateLimit-Reset", Math.floor(reset / 1000));

  if (!success) {
    return res.status(429).json({
      success: false,
      status: 429,
      message: "Too many requests. Please try again later."
    });
  }

  next();
}

/*
* ? GLOBAL USAGE
import express from "express";
import { rateLimiter } from "./middlewares/rate-limiter";

const app = express();

app.use(rateLimiter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
*/
