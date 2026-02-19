import mongoose from "mongoose";
import env from "./env";

import { logger } from "../utils/logger";

if (!env.DATABASE_URL) {
  throw new Error("Please provide DATABASE_URL in the environment variables");
}

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(env.DATABASE_URL as string);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(error, "MongoDB Connection Failed:");
    process.exit(1);
  }
};
