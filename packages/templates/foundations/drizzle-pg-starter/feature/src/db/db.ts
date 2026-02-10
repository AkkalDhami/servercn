import { drizzle } from "drizzle-orm/node-postgres";
import env from "../shared/configs/env";

const db = drizzle(env.DATABASE_URL!, {
  logger: env.NODE_ENV === "development"
});

export default db;
