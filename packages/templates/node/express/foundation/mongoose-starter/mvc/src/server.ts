import { connectDB } from "./configs/db";
import { logger } from "./utils/logger";
import app from "./app";
import env from "./configs/env";
import { configureGracefulShutdown } from "./utils/shutdown";

const port = env.PORT;

connectDB()
  .then(() => {
    const server = app.listen(port, () => {
      logger.info(`[server]: Server is running at http://localhost:${port}`);
      logger.info(`[server]: Environment: ${port}`);
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
