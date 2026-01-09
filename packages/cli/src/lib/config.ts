import fs from "fs-extra";
import path from "node:path";
import { logger } from "../utils/cli-logger";
import type { ServerCNConfig } from "../types";

export const SERVERCN_CONFIG_FILE = "servercn.json" as const;

export async function getServerCNConfig(): Promise<ServerCNConfig> {
  const cwd = process.cwd();
  const configPath = path.resolve(cwd, SERVERCN_CONFIG_FILE);

  if (!(await fs.pathExists(configPath))) {
    logger.warn("ServerCN is not initialized. Run `servercn init` first.");
    process.exit(1);
  }

  return fs.readJSON(configPath);
}
