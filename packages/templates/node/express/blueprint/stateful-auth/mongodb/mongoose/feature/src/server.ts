import app from "./app";
import { connectDB } from "./shared/configs/db";
import env from "./shared/configs/env";
import { logger } from "./shared/utils/logger";
import { configureGracefulShutdown } from "./shared/utils/shutdown";

const port = env.PORT || 9000;

connectDB();

const server = app.listen(port, () => {
  logger.info(`[server]: Server is running at http://localhost:${port}`);
  logger.info(`[server]: Environment: ${port}`);
  logger.info(`[server]: Swagger Docs: http://localhost:${port}/api/docs`);
});

configureGracefulShutdown(server);
