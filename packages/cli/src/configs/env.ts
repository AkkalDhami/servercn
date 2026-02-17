import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  NODE_ENV: z.string().default("development"),
  SERVERCN_SILENT: z.string().default("true"),
  LOG_LEVEL: z.string().default("info")
});
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "❌ Invalid environment variables:",
    z.prettifyError(parsed.error)
  );
  process.exit(1);
}

export const env = parsed.data;
