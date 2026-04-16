import mongoose from "mongoose";
import env from "./env";

if (!env.DATABASE_URL) {
  throw new Error("Please provide DATABASE_URL in the environment variables");
}

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(env.DATABASE_URL as string);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

/**
 * ? Usage:
 * server.ts
 * import { connectDB } from "../configs/db";
 * connectDB()
  .then(() => {
    const server = app.listen(env.PORT, () => {
      logger.info(`[server]: Server is running at http://localhost:${env.PORT}`);
      logger.info(`[server]: Environment: ${env.NODE_ENV}`);
      logger.info(
        `[server]: Swagger docs are available at http://localhost:${env.PORT}/api/docs`
      );
    });
    configureGracefulShutdown(server);
  })
  .catch(error => {
    logger.error(error, "MongoDB Connection Failed:");
    process.exit(1);
  });
 */
