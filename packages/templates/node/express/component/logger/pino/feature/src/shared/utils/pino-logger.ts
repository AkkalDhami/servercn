import pino from "pino";
import env from "../configs/env";

const isProduction = env.NODE_ENV === "production";

export const logger = pino({
  level: env.LOG_LEVEL || "info",

  base: {
    pid: process.pid
  },

  timestamp: pino.stdTimeFunctions.isoTime,

  formatters: {
    level(label) {
      return { level: label };
    }
  },

  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "password",
      "token",
      "refreshToken"
    ],
    censor: "[REDACTED]"
  },

  ...(isProduction
    ? {}
    : {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname"
          }
        }
      })
});

/**
 * USAGE:
 * 
  logger.warn({ userId: "123" }, "Suspicious activity detected");
  logger.error(
  { err: "Database connection failed" },
  "Database connection failed"
  );
 */