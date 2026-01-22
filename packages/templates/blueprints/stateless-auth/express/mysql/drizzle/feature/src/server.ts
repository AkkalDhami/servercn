import app from "./app";
import env from "./shared/configs/env";
import { connectRedis } from "./shared/configs/redis";
import { logger } from "./shared/utils/logger";
import { configureGracefulShutdown } from "./shared/utils/shutdown";

const port = env.PORT || 9000;

connectRedis();

const server = app.listen(port, () => {
  logger.info(`[server]: Server is running at http://localhost:${port}`);
  logger.info(
    `[server]: Swagger docs are available at http://localhost:${port}/api/docs`
  );
});

configureGracefulShutdown(server);
