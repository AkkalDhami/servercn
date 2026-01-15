import { Server } from "http";
import { logger } from "./logger";

export const configureGracefulShutdown = (server: Server) => {
  const signals = ["SIGTERM", "SIGINT"];

  signals.forEach(signal => {
    process.on(signal, () => {
      logger.info(`\n${signal} signal received. Shutting down gracefully...`);

      server.close(err => {
        if (err) {
          logger.error(err, "Error during server close");
          process.exit(1);
        }

        logger.info("HTTP server closed.");
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error("Could not close connections in time, forcefully shutting down");
        process.exit(1);
      }, 10000);
    });
  });
};
