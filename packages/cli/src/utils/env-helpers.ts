import { existsSync } from "node:fs";
import path from "node:path";
import type { EnvVar } from "./inject-env-schema";

export function isEnvFile(filePath: string): boolean {
  return /^\.env(\..+)?$/.test(path.basename(filePath));
}

export function findExistingEnvFile(targetDir: string): string | null {
  const variants = [
    ".env.local",
    ".env",
    ".env.development.local",
    ".env.development"
  ];

  for (const variant of variants) {
    const filePath = path.join(targetDir, variant);
    if (existsSync(filePath)) return filePath;
  }

  return null;
}

export function mapEnvToZod(envs: string[]): EnvVar[] {
  return envs.map(name => {
    const upper = name.toUpperCase();

    if (upper.includes("NODE_ENV")) {
      return {
        name,
        zod: `z.enum(["development", "test", "production"]).default("development")`
      };
    }

    if (upper.includes("LOG_LEVEL")) {
      return {
        name,
        zod: `z.enum(["debug", "info", "warn", "error"]).default("info")`
      };
    }

    if (upper.includes("EMAIL")) {
      return { name, zod: "z.email()" };
    }

    if (upper.includes("URL") || upper.includes("URI")) {
      return { name, zod: "z.url()" };
    }

    if (upper.includes("PORT")) {
      return {
        name,
        zod: 'z.string().regex(/^\\d+$/, "Must be a number").transform(Number)'
      };
    }

    if (upper.includes("ENABLED") || upper.startsWith("IS_")) {
      return { name, zod: "z.boolean()" };
    }

    if (upper.includes("TIMEOUT") || upper.includes("INTERVAL")) {
      return {
        name,
        zod: "z.string().regex(/^\\d+$/).transform(Number)"
      };
    }

    if (
      upper.includes("SECRET") ||
      upper.includes("KEY") ||
      upper.includes("TOKEN")
    ) {
      return { name, zod: "z.string()" };
    }

    return { name, zod: "z.string()" };
  });
}
