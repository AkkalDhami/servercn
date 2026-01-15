import { rateLimit } from "express-rate-limit";
import { ApiError } from "../errors/api-error";
import { STATUS_CODES } from "../constants/status-codes";

/**
 * Standard rate limiter middleware
 */
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    next(ApiError.tooManyRequests("Too many requests, please try again later"));
  }
});

/**
 * Stricter rate limiter for sensitive routes
 */
export const authRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  handler: (req, res, next, options) => {
    next(new ApiError(STATUS_CODES.TOO_MANY_REQUESTS, "Too many attempts, please try again later"));
  }
});

/**
 * Make sure global error handler is set up to handle ApiError
 */
