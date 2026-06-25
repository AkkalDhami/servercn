import mongoose, { Connection } from "mongoose";

const MONGODB_URI = process.env.DATABASE_URL!;

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI environment variable");
}

const globalCache = global.mongooseCache ?? {
  conn: null,
  promise: null
};

global.mongooseCache = globalCache;

export async function dbConnect(): Promise<Connection> {
  if (globalCache.conn) {
    return globalCache.conn;
  }

  if (!globalCache.promise) {
    globalCache.promise = mongoose.connect(MONGODB_URI).then(m => m.connection);
  }

  try {
    globalCache.conn = await globalCache.promise;
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    globalCache.promise = null;
    throw error;
  }

  console.log("✅ MongoDB connected");
  return globalCache.conn;
}