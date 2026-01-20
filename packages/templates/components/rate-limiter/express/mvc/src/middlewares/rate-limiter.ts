import { rateLimit } from "express-rate-limit";
import { ApiError } from "../utils/api-error";
import { STATUS_CODES } from "../constants/status-codes";

/**
 * Standard rate limiter middleware
 * Limits each IP to 100 requests per 15-minute window
 */
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message:
      "Too many requests from this IP, please try again after 15 minutes",
    status: 429
  },
  handler: (req, res, next, options) => {
    next(new ApiError(STATUS_CODES.TOO_MANY_REQUESTS, options.message.message));
  }
});

/**
 * Stricter rate limiter for sensitive routes (e.g., auth, login)
 */
export const authRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 failed attempts per hour
  handler: (req, res, next, options) => {
    next(
      ApiError.tooManyRequests(
        "Too many login attempts, please try again after an hour"
      )
    );
  }
});

/**
 * Make sure global error handler is set up to handle ApiError
 */
