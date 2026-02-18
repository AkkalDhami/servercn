import { existsSync } from "node:fs";
import path from "node:path";

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
