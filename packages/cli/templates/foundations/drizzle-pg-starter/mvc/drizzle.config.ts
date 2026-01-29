import { Config, defineConfig } from "drizzle-kit";

import env from "./src/configs/env";

export default defineConfig({
  out: "./src/drizzle/migrations",
  schema: "./src/drizzle/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL!
  },
  verbose: true,
  strict: true
}) satisfies Config;
