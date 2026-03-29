/* eslint-disable no-console */
import "dotenv-flow/config";
import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.string().regex(/^\d+$/, "PORT must be a number").transform(Number),
  CORS_ORIGIN: z.string(),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("info"),

  FACEBOOK_APP_ID: z.string(),
  FACEBOOK_APP_SECRET: z.string(),
  FACEBOOK_REDIRECT_URI: z.url(),

  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_REDIRECT_URI: z.url()
});

export type Env = z.infer<typeof envSchema>;

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("❌ Invalid environment configuration");
  console.error(z.treeifyError(result.error));
  process.exit(1);
}

export const env: Readonly<Env> = Object.freeze(result.data);

export default env;
