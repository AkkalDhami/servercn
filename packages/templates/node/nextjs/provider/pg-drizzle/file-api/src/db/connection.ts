import { drizzle } from "drizzle-orm/node-postgres";

const db = drizzle(process.env.DATABASE_URL!, {
  logger: process.env.NODE_ENV === "development"
});

export default db;