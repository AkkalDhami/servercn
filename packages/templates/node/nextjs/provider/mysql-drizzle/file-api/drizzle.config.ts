import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./migrations",
  schema: "./src/db/index.ts",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.DATABASE_URL!
  },
  verbose: true,
  strict: true
});

/**
 * Add the following scripts to your package.json:
 *
 * "db:generate": "drizzle-kit generate" // Generate migration files
 * "db:migrate": "drizzle-kit migrate"   // Apply migrations to the database
 * "db:studio": "drizzle-kit studio"     // Open Drizzle Studio
 **/
