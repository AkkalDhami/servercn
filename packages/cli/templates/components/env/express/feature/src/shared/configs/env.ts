import "dotenv/config";
import { z } from "zod";

/**
 * Environment variable schema
 * - All validation happens at startup
 * - Fails fast on misconfiguration
 */
export const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.string().regex(/^\d+$/, "PORT must be a number").transform(Number),

  DATABASE_URL: z.url(),

  CORS_ORIGIN: z.string(),

  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("info"),

  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),

  CRYPTO_SECRET: z.string().min(32),

  SMTP_HOST: z.string(),
  SMTP_PORT: z
    .string()
    .regex(/^\d+$/, "SMTP_PORT must be a number")
    .transform(Number),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),
  EMAIL_FROM: z.email(),

  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),

  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_REDIRECT_URI: z.url(),

  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  GITHUB_REDIRECT_URI: z.url()
});

export type Env = z.infer<typeof envSchema>;

/**
 * Parse and validate environment variables once.
 * This module must be imported before app bootstrap.
 */
const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("❌ Invalid environment configuration");
  console.error(z.prettifyError(result.error));
  process.exit(1);
}

/**
 * Validated, immutable environment object
 */
export const env: Readonly<Env> = Object.freeze(result.data);

export default env;
