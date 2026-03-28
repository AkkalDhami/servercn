import app from "./app";
import env from "./shared/configs/env";
import redisClient from "./shared/configs/redis";
import { logger } from "./shared/utils/logger";
import { configureGracefulShutdown } from "./shared/utils/shutdown";

const port = env.PORT || 9000;

redisClient
  .connect()
  .then(() => {
    logger.info("Redis Connection Success");
    const server = app.listen(port, () => {
      logger.info(`[server]: Server is running at http://localhost:${port}`);
      logger.info(`[server]: Environment: ${env.NODE_ENV}`);
      logger.info(
        `[server]: Swagger docs are available at http://localhost:${port}/api/docs`
      );
    });

    configureGracefulShutdown(server);
  })
  .catch((error: Error) => {
    logger.error(error, "Redis Connection Failed");
    process.exit(1);
  });
