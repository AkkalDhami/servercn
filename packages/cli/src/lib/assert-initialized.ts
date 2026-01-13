import fs from "fs-extra";
import path from "path";
import { logger } from "../utils/cli-logger";
import { SERVERCN_CONFIG_FILE } from "../constants/app-constants";

export async function assertInitialized() {
  const configPath = path.resolve(process.cwd(), SERVERCN_CONFIG_FILE);

  if (!(await fs.pathExists(configPath))) {
    logger.error("ServerCN is not initialized in this project.");
    logger.info("Run the following command first:");
    logger.info("  npx servercn init");
    process.exit(1);
  }
}
