import fs from "fs-extra";
import path from "path";
import { logger } from "../utils/cli-logger";

const CONFIG_FILE = "servercn.json";

export async function assertInitialized() {
  const configPath = path.resolve(process.cwd(), CONFIG_FILE);

  if (!(await fs.pathExists(configPath))) {
    logger.error("ServerCN is not initialized in this project.");
    logger.info("Run the following command first:");
    logger.info("  npx servercn init");
    process.exit(1);
  }
}
