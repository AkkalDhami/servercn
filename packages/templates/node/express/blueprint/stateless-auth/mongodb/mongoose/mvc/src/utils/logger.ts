import pino from "pino";
import env from "../configs/env";

export const logger = pino({
  level: env.LOG_LEVEL,
  transport:
    env.NODE_ENV !== "production"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "yyyy-mm-dd HH:MM:ss",
            ignore: "pid,hostname"
          }
        }
      : undefined
});
