import mongoose from "mongoose";
import { env } from "./env";

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
