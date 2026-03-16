import app from "./app";
import { connectDB } from "./db/db";
import env from "./shared/configs/env";
import { logger } from "./shared/utils/logger";
import { configureGracefulShutdown } from "./shared/utils/shutdown";

const port = env.PORT;

connectDB()
  .then(() => {
    const server = app.listen(port, () => {
      logger.info(`[server]: Server is running at http://localhost:${port}`);
      logger.info(`[server]: Environment: ${env.NODE_ENV}`);
      logger.info(
        `[server]: Swagger docs are available at http://localhost:${port}/api/docs`
      );
    });
    configureGracefulShutdown(server);
  })
  .catch(error => {
    logger.error(error, "MongoDB Connection Failed:");
    process.exit(1);
  });
