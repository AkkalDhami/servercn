import { defineConfig } from "drizzle-kit";
import { env } from "./src/configs/env";

export default defineConfig({
  out: "./migrations",
  schema: "./src/db/index.ts",
  dialect: "mysql",
  dbCredentials: {
    url: env.DATABASE_URL
  },
  verbose: true,
  strict: true
});
