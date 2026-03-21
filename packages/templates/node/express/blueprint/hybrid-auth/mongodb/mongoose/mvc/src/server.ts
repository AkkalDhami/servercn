import app from "./app";
import { connectDB } from "./configs/db";
import env from "./configs/env";
import redisClient from "./configs/redis";
import { logger } from "./utils/logger";
import { configureGracefulShutdown } from "./utils/shutdown";

const port = env.PORT || 9000;

connectDB().then(() => {
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
    .catch(error => {
      logger.error(error, "Redis Connection Failed");
      process.exit(1);
    });
});
