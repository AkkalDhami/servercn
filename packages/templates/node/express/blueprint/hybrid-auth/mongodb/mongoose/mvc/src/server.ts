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
        logger.info("Hybrid Auth API started successfully");
        logger.info(`URL          : http://localhost:${port}`);
        logger.info(`Environment  : ${env.NODE_ENV}`);
        logger.info(
          `Version      : ${process.env.npm_package_version ?? "unknown"}`
        );
        logger.info(`Started At   : ${new Date().toISOString()}`);

        if (env.NODE_ENV !== "production") {
          logger.info(`API Docs     : http://localhost:${port}/api/docs`);
        }
      });

      configureGracefulShutdown(server);
    })
    .catch(error => {
      logger.error(error, "Redis Connection Failed");
      process.exit(1);
    });
});
