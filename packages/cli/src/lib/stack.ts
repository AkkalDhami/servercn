import type { StackConfig } from "../types";
import { logger } from "../utils/logger";

export function parseStack(stack: string): StackConfig {
  const [framework, database, language] = stack.split("-");

  if (framework !== "express") {
    logger.error(`unsupported framework: ${framework}`);
    process.exit(1);
  }

  return {
    framework: "express",
    database: database as StackConfig["database"],
    language: language as StackConfig["language"]
  };
}
