import { z } from "zod";
const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "test", "proud"]).default("dev"),
  SERVERCN_SILENT: z.string().default("true"),
  LOG_LEVEL: z.string().default("info"),
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
