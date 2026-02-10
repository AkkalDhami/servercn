import { Server } from "http";

/**
 * Gracefully shuts down the server when a termination signal is received.
 * @param server The HTTP server instance to close.
 */
export const configureGracefulShutdown = (server: Server) => {
  const signals = ["SIGTERM", "SIGINT"];

  signals.forEach(signal => {
    process.on(signal, () => {
      console.log(`\n${signal} signal received. Shutting down gracefully...`);

      server.close(err => {
        if (err) {
          console.error("Error during server close:", err);
          process.exit(1);
        }

        console.log("HTTP server closed.");
        // Add additional cleanup logic here (e.g., closing database connections)
        process.exit(0);
      });

      // Force shutdown after 10 seconds if graceful shutdown fails
      setTimeout(() => {
        console.error(
          "Could not close connections in time, forcefully shutting down"
        );
        process.exit(1);
      }, 10000);
    });
  });
};
