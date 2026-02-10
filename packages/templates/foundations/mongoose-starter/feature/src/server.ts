import app from "./app";
import { connectDB } from "./db/db";
import env from "./shared/configs/env";
import { logger } from "./shared/utils/logger";
import { configureGracefulShutdown } from "./shared/utils/shutdown";

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
