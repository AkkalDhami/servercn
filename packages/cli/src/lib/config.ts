import fs from "fs-extra";
import path from "node:path";
import { ServerCNConfig } from "../types";
import { logger } from "../utils/cli-logger";

export const SERVERCN_CONFIG = "servercn.json" as const;

export async function getServerCNConfig(): Promise<ServerCNConfig> {
  const cwd = process.cwd();
  const configPath = path.resolve(cwd, "servercn.json");

  if (!(await fs.pathExists(configPath))) {
    logger.warn("ServerCN is not initialized. Run `servercn init` first.");
    process.exit(1);
  }

  return fs.readJSON(configPath);
}
