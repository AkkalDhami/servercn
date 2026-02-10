import { Config, defineConfig } from "drizzle-kit";

import env from "./src/shared/configs/env";

export default defineConfig({
  out: "./src/drizzle/migrations",
  schema: "./src/drizzle/index.ts",
  dialect: "mysql",
  dbCredentials: {
    url: env.DATABASE_URL!
  },
  verbose: true,
  strict: true
}) satisfies Config;
