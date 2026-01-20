import fs from "fs-extra";
import path from "path";
import { logger } from "../utils/cli-logger";
import { SERVERCN_CONFIG_FILE } from "../constants/app-constants";
import { env } from "../configs/env";

export async function assertInitialized() {
  const configPath = path.resolve(process.cwd(), SERVERCN_CONFIG_FILE);

  if (!(await fs.pathExists(configPath))) {
    logger.error("ServerCN is not initialized in this project.");
    logger.info("Run the following command first:");
    logger.log("- npx servercn init");
    logger.muted("For express server: npx servercn init express-server");
    logger.muted(
      "For (Drizzle + MySQL) Starter: npx servercn init drizzle-mysql-server"
    );
    logger.muted(
      "For (Drizzle + PostgreSQL) Starter: npx servercn init drizzle-pg-server"
    );

    logger.muted(
      `Visit ${env.SERVERCN_URL}/docs/installation for more information`
    );
    process.exit(1);
  }
}
