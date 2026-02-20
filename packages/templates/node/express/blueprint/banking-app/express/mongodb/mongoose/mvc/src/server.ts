import app from "./app";
import { connectDB } from "./configs/db";
import env from "./configs/env";
import { logger } from "./utils/logger";
import { configureGracefulShutdown } from "./utils/shutdown";

const port = env.PORT || 9000;

connectDB();

const server = app.listen(port, () => {
  logger.info(`[server]: Server is running at http://localhost:${port}`);
  logger.info(`Swagger docs available at http://localhost:${port}/api/docs`);
});

configureGracefulShutdown(server);
