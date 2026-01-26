import fs from "fs-extra";
import path from "node:path";
import { logger } from "../utils/logger";
import type { ServerCNConfig } from "../types";
import { SERVERCN_CONFIG_FILE } from "../constants/app-constants";

export async function getServerCNConfig(): Promise<ServerCNConfig> {
  const cwd = process.cwd();
  const configPath = path.resolve(cwd, SERVERCN_CONFIG_FILE);

  if (!(await fs.pathExists(configPath))) {
    logger.warn("ServerCN is not initialized. Run `servercn init` first.");
    process.exit(1);
  }

  return fs.readJSON(configPath);
}

export function getDatabaseConfig(foundation: string) {
  switch (foundation) {
    case "express-server":
    case "mongoose-starter":
      return { type: "mongodb", orm: "mongoose" };
    case "drizzle-mysql-starter":
      return { type: "mysql", orm: "drizzle" };
    case "drizzle-pg-starter":
      return { type: "postgresql", orm: "drizzle" };
    case "prisma-mongo-starter":
      return { type: "mongodb", orm: "prisma" };
    case "prisma-pg-starter":
      return { type: "postgresql", orm: "prisma" };
    default:
      return null;
  }
}
