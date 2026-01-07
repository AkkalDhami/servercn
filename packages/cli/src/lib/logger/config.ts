import { env } from "@/src/configs/env";
import { LoggerOptions } from "pino";

const isProd = env.NODE_ENV === "proud";

export const pinoConfig: LoggerOptions = {
  level: env.LOG_LEVEL || "info",

  base: {
    pid: false,
  },

  timestamp: () => `,"time":"${new Date().toISOString()}"`,

  formatters: {
    level(label) {
      return { level: label };
    },
  },

  ...(isProd
    ? {}
    : {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "HH:MM:ss",
            ignore: "pid,hostname",
          },
        },
      }),
};
