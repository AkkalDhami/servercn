import fs from "fs-extra";
import path from "path";
import { logger } from "@/utils/logger";
import { APP_NAME, SERVERCN_CONFIG_FILE } from "@/constants/app-constants";
import { env } from "@/configs/env";

export async function assertInitialized() {
  const configPath = path.resolve(process.cwd(), SERVERCN_CONFIG_FILE);

  if (!(await fs.pathExists(configPath))) {
    logger.error(`${APP_NAME} is not initialized in this project.`);
    logger.info("Run the following command first:");
    logger.log("=> npx servercn init");
    logger.muted("For express server: npx servercn init express-server");
    logger.muted(
      "For (drizzle + mysql) starter: npx servercn init drizzle-mysql-starter"
    );
    logger.muted(
      "For (drizzle + postgresql) starter: npx servercn init drizzle-pg-starter"
    );

    logger.muted(
      `Visit ${env.SERVERCN_URL}/docs/installation for more information`
    );
    process.exit(1);
  }
}
