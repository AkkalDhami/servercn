import { drizzle } from "drizzle-orm/mysql2";
import env from "./env";

const db = drizzle(env.DATABASE_URL!, {
  logger: env.NODE_ENV === "development"
});

export default db;
