import { logger } from "../utils/cli-logger";

export type StackConfig = {
  framework: "express";
  database: "mongodb" | "postgres" | "mysql";
  language: "ts" | "js";
};

export function parseStack(stack: string): StackConfig {
  const [framework, database, language] = stack.split("-");

  if (framework !== "express") {
    logger.error(`Unsupported framework: ${framework}`);
    process.exit(1);
  }

  return {
    framework: "express",
    database: database as StackConfig["database"],
    language: language as StackConfig["language"],
  };
}
