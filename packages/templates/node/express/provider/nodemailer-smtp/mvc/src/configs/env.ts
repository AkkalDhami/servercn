import "dotenv-flow/config";
import { z } from "zod";

export const envSchema = z.object({
  SMTP_HOST: z.string(),
  SMTP_PORT: z
    .string()
    .regex(/^\d+$/, "SMTP_PORT must be a number")
    .transform(Number),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),
  EMAIL_FROM: z.email()
});

export type Env = z.infer<typeof envSchema>;

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("❌ Invalid environment configuration");
  console.error(z.prettifyError(result.error));
  process.exit(1);
}

export const env: Readonly<Env> = Object.freeze(result.data);

export default env;
