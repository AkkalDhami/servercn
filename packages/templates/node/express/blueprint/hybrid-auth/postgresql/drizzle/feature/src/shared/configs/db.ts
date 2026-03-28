import { drizzle } from "drizzle-orm/node-postgres";
import env from "./env";
import * as schema from "../../drizzle";

const db = drizzle(env.DATABASE_URL!, {
  schema,
  logger: env.NODE_ENV === "development"
});

export default db;
