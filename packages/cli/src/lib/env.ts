import fs from "node:fs";
import path from "node:path";
import { logger } from "@/utils/logger";

export function updateEnvExample(envKeys: string[] = [], cwd = process.cwd()) {
  if (!envKeys.length) return;

  const envExamplePath = path.join(cwd, ".env.example");

  const existing = fs.existsSync(envExamplePath)
    ? fs.readFileSync(envExamplePath, "utf8")
    : "";

  const existingKeys = new Set(
    existing
      .split("\n")
      .map(line => line.split("=")[0]?.trim())
      .filter(Boolean)
  );

  const newLines = envKeys
    .filter(key => !existingKeys.has(key))
    .map(key => `${key}=`);

  if (!newLines.length) return;

  const content =
    existing.trim().length > 0
      ? `${existing.trim()}\n\n${newLines.join("\n")}\n`
      : `${newLines.join("\n")}\n`;

  fs.writeFileSync(envExamplePath, content, "utf8");

  logger.log(`Updated .env.example`);
  logger.info(`Configure your environment variables in .env file.`);
}
