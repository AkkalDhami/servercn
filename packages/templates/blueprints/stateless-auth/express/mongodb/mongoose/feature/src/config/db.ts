import mongoose from "mongoose";
import { logger } from "../shared/utils/logger";
import env from "../shared/configs/env";

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(env.DATABASE_URL as string);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(error, "MongoDB Connection Failed");
    process.exit(1);
  }
};
