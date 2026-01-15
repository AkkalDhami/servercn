import { drizzle } from "drizzle-orm/mysql2";
import env from "./env";

const db = drizzle(env.DATABASE_URL!);

export default db;
