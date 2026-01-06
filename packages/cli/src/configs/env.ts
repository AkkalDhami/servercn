import { z } from "zod";
// import "dotenv/config";
const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "test", "proud"]).default("dev"),
  SERVERCN_SILENT: z.string().default("true"),
  //   PORT: z.string().default("3000"),
  //   DATABASE_URL: z.string(),

  LOG_LEVEL: z.string().default("info"),
  //   JOIN_CODE_ENCRYPTION_KEY: z.string(),

  //   JWT_REFRESH_SECRET: z.string(),
  //   JWT_ACCESS_SECRET: z.string(),
  //   COOKIE_SECRET: z.string(),

  //   SMTP_HOST: z.string(),
  //   SMTP_PORT: z.string(),
  //   SMTP_USER: z.string(),
  //   EMAIL_FROM: z.string(),

  //   CLOUDINARY_CLOUD_NAME: z.string(),
  //   CLOUDINARY_API_KEY: z.string(),
  //   CLOUDINARY_API_SECRET: z.string(),

  //   REDIS_URL: z.string(),

  //   GOOGLE_CLIENT_ID: z.string(),
  //   GOOGLE_CLIENT_SECRET: z.string(),
  //   GOOGLE_REDIRECT_URI: z.string(),
});
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "❌ Invalid environment variables:",
    parsed.error.flatten().fieldErrors
  );
  process.exit(1);
}

export const env = parsed.data;
