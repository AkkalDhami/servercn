import { connectDB } from "./configs/db";
import { logger } from "./utils/logger";
import app from "./app";
import env from "./configs/env";
import { configureGracefulShutdown } from "./utils/shutdown";

connectDB()
  .then(() => {
    const server = app.listen(env.PORT, () => {
      logger.info(`Server is running on http://localhost:${env.PORT}`);
    });
    configureGracefulShutdown(server);
  })
  .catch(error => {
    logger.error(error, "MongoDB Connection Failed:");
    process.exit(1);
  });
