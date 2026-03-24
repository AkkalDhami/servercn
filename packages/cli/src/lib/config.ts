import fs from "fs-extra";
import path from "node:path";
import { logger } from "@/utils/logger";
import type { DatabaseConfig, FrameworkType, IServerCNConfig } from "@/types";
import { SERVERCN_CONFIG_FILE } from "@/constants/app.constants";

export async function getServerCNConfig(): Promise<IServerCNConfig> {
  const cwd = process.cwd();
  const configPath = path.resolve(cwd, SERVERCN_CONFIG_FILE);

  if (!(await fs.pathExists(configPath))) {
    logger.warn(
      "\nServercn is not initialized. Run `npx servercn-cli init` first.\n"
    );
    process.exit(1);
  }

  return fs.readJSON(configPath);
}

export function getDatabaseConfig(foundation: string): DatabaseConfig | null {
  switch (foundation) {
    case "mongoose-starter":
      return {
        engine: "mongodb",
        adapter: "mongoose"
      };
    case "drizzle-mysql-starter":
      return {
        engine: "mysql",
        adapter: "drizzle"
      };
    case "drizzle-pg-starter":
      return {
        engine: "postgresql",
        adapter: "drizzle"
      };
    case "prisma-mongodb-starter":
      return {
        engine: "mongodb",
        adapter: "prisma"
      };
    default:
      return null;
  }
}

export function getFrameworkConfig(foundation: string): FrameworkType {
  switch (foundation) {
    case "express-starter":
    case "mongoose-starter":
    case "drizzle-mysql-starter":
    case "drizzle-pg-starter":
    case "prisma-mongodb-starter":
      return "express";
    case "nextjs-starter":
      return "nextjs";
    default:
      return "express";
  }
}
