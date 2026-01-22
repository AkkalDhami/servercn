import { z } from "zod";
import "dotenv/config";
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  SERVERCN_SILENT: z.string().default("true"),
  LOG_LEVEL: z.string().default("info"),
  SERVERCN_URL: z.string().default("https://servercn.vercel.app")
});
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "❌ Invalid environment variables:",
    z.treeifyError(parsed.error)
  );
  process.exit(1);
}

export const env = parsed.data;
