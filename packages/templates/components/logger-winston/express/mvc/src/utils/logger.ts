import env from "../configs/env";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}] : ${stack || message}`;
});

const transports: winston.transport[] = [];

/**
 * Console logging (development / local)
 */
if (env.NODE_ENV !== "production") {
  transports.push(
    new winston.transports.Console({
      format: combine(colorize(), timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), errors({ stack: true }), logFormat)
    })
  );
}

/**
 * File logging (staging / production)
 */
if (env.NODE_ENV !== "development") {
  transports.push(
    new DailyRotateFile({
      dirname: "logs/app",
      filename: "app-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      level: "info"
    })
  );

  transports.push(
    new DailyRotateFile({
      dirname: "logs/error",
      filename: "errors-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "30d",
      level: "error"
    })
  );
}

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), errors({ stack: true }), logFormat),
  transports,
  exitOnError: false
});
