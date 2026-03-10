import fs from "fs-extra";
import path from "node:path";
import { logger } from "@/utils/logger";
import type { DatabaseConfig, IServerCNConfig } from "@/types";
import { SERVERCN_CONFIG_FILE } from "@/constants/app.constants";

export async function getServerCNConfig(): Promise<IServerCNConfig> {
  const cwd = process.cwd();
  const configPath = path.resolve(cwd, SERVERCN_CONFIG_FILE);

  if (!(await fs.pathExists(configPath))) {
    logger.warn("\nServerCN is not initialized. Run `npx servercn-cli init` first.\n");
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
    default:
      return null;
  }
}
