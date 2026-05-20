import z from "zod";

export const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  DATABASE_URL: z.url(),

  CORS_ORIGIN: z.string(),

  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("info"),

  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),

  CRYPTO_SECRET: z.string().min(32),

  SMTP_HOST: z.string(),
  SMTP_PORT: z.string().regex(/^\d+$/).transform(Number),
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
  GITHUB_REDIRECT_URI: z.url(),

  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL
});

export type Env = z.infer<typeof envSchema>;

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables");
  console.error(z.prettifyError(parsed.error));
  process.exit(1);
}

const env = Object.freeze(parsed.data);

export default env;

/*
* ? Usage:
* import env from "@/configs/env";
* console.log(env.DATABASE_URL);
*/