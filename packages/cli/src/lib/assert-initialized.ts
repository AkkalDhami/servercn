import fs from "fs-extra";
import path from "path";
import { logger } from "@/utils/logger";
import {
  APP_NAME,
  SERVERCN_CONFIG_FILE,
  SERVERCN_URL
} from "@/constants/app.constants";
import { highlighter } from "@/utils/highlighter";

export async function assertInitialized() {
  const configPath = path.resolve(process.cwd(), SERVERCN_CONFIG_FILE);

  if (!(await fs.pathExists(configPath))) {
    logger.break();
    logger.error(`${APP_NAME} is not initialized in this project.`);
    logger.break();
    logger.log("Run the following command first:");
    logger.log(`> ${highlighter.create("npx servercn-cli init")}`);
    logger.break();
    logger.log(
      `For express starter:\n> ${highlighter.create("npx servercn-cli init express-server")}`
    );
    logger.break();
    logger.log(
      `For (express + mongoose) starter:\n> ${highlighter.create("npx servercn-cli init mongoose-starter")}`
    );
    logger.break();
    logger.log(
      `For (drizzle + mysql) starter:\n> ${highlighter.create("npx servercn-cli init drizzle-mysql-starter")}`
    );
    logger.break();
    logger.log(
      `For (drizzle + postgresql) starter:\n> ${highlighter.create("npx servercn-cli init drizzle-pg-starter")}`
    );
    logger.break();

    logger.info(`Visit ${SERVERCN_URL}/docs/installation for more information`);
    logger.break();
    process.exit(1);
  }
}
