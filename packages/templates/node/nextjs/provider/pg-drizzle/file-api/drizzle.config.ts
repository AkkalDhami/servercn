import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./migrations",
  schema: "./src/db/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!
  },
  verbose: true,
  strict: true
});

/**
 *? Add the following scripts to your package.json:
 *
 * 1. "db:generate": "drizzle-kit generate" //* Generate migration files
 * 2. "db:migrate": "drizzle-kit migrate"   //* Apply migrations to the database
 * 3. "db:studio": "drizzle-kit studio"     //* Open Drizzle Studio

 * 4. "db:push": "npx drizzle-kit push"  //* You can directly apply changes to your database using this command.
 **/
