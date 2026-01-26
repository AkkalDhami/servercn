import fs from "fs-extra";
import path from "path";
import { logger } from "../utils/logger";
import { SERVERCN_CONFIG_FILE } from "../constants/app-constants";
import { env } from "../configs/env";

export async function assertInitialized() {
  const configPath = path.resolve(process.cwd(), SERVERCN_CONFIG_FILE);

  if (!(await fs.pathExists(configPath))) {
    logger.error("servercn is not initialized in this project.");
    logger.info("run the following command first:");
    logger.log("=> npx servercn init");
    logger.muted("for express server: npx servercn init express-server");
    logger.muted(
      "for (drizzle + mysql) starter: npx servercn init drizzle-mysql-starter"
    );
    logger.muted(
      "for (drizzle + postgresql) starter: npx servercn init drizzle-pg-starter"
    );

    logger.muted(
      `visit ${env.SERVERCN_URL}/docs/installation for more information`
    );
    process.exit(1);
  }
}
