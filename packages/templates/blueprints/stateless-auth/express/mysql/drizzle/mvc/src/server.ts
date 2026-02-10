import app from "./app";
import env from "./configs/env";
import { connectRedis } from "./configs/redis";
import { logger } from "./utils/logger";
import { configureGracefulShutdown } from "./utils/shutdown";

const port = env.PORT || 9000;

connectRedis();

const server = app.listen(port, () => {
  logger.info(`[server]: Server is running at http://localhost:${port}`);
  logger.info(
    `[server]: Swagger docs are available at http://localhost:${port}/api/docs`
  );
});

configureGracefulShutdown(server);
