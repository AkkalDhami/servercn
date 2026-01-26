import { defineConfig } from "drizzle-kit";

import env from "./src/configs/env";

export default defineConfig({
  out: "./src/drizzle/migrations",
  schema: "./src/drizzle/schema.ts",
  dialect: "mysql",
  dbCredentials: {
    url: env.DATABASE_URL!
  },
  verbose: true,
  strict: true
});
