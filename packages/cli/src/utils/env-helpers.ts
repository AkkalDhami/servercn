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

export function parseEnvContent(content: string): Record<string, string> {
  const result: Record<string, string> = {};

  const lines = content.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const index = trimmed.indexOf("=");
    if (index === -1) continue;

    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim();

    result[key] = value;
  }

  return result;
}

export function getNewEnvKeys(
  existingContent: string,
  newContent: string
): string[] {
  const existing = parseEnvContent(existingContent);
  const incoming = parseEnvContent(newContent);

  return Object.keys(incoming).filter(key => !(key in existing));
}

export function mergeEnvContent(
  existingContent: string,
  newContent: string
): string {
  const existing = parseEnvContent(existingContent);
  const incoming = parseEnvContent(newContent);

  const additions: string[] = [];

  for (const [key] of Object.entries(incoming)) {
    if (!(key in existing)) {
      additions.push(`\n${key}='${key.split("=").join("-").toLowerCase()}'`);
    }
  }

  if (!additions.length) {
    return existingContent.endsWith("\n")
      ? existingContent
      : existingContent + "\n";
  }

  const base = existingContent.trimEnd();

  const block =
    `\n# ${additions[0].replaceAll("\n", "").split("=")[0].replaceAll("_", "")}\n` +
    additions.join("\n") +
    "\n";

  return base + block;
}
