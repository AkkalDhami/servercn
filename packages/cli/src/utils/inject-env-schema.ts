import fs from "fs";
import { logger } from "./logger";
import { highlighter } from "./highlighter";

export type EnvVar = {
  name: string;
  zod: string;
};

type Options = {
  filePath: string;
  variables: EnvVar[];
  dryRun?: boolean;
};

export function injectEnvSchema({
  filePath,
  variables,
  dryRun = false
}: Options) {
  const content = fs.readFileSync(filePath, "utf-8");

  // Find z.object({
  const startIndex = content.indexOf("z.object({");
  if (startIndex === -1) {
    logger.error("z.object({ not found in env.ts");
    process.exit(1);
  }

  // Find matching closing }
  let braceCount = 0;
  let i = startIndex;
  let objectStart = -1;
  let objectEnd = -1;

  for (; i < content.length; i++) {
    if (content[i] === "{") {
      braceCount++;
      if (braceCount === 1) objectStart = i;
    } else if (content[i] === "}") {
      braceCount--;
      if (braceCount === 0) {
        objectEnd = i;
        break;
      }
    }
  }

  if (objectStart === -1 || objectEnd === -1) {
    logger.error("Failed to parse z.object body");
    return;
  }

  const before = content.slice(0, objectStart + 1);
  const body = content.slice(objectStart + 1, objectEnd);
  const after = content.slice(objectEnd);

  // Extract existing keys
  const existingKeys = Array.from(body.matchAll(/^\s*([A-Z0-9_]+)\s*:/gm)).map(
    m => m[1]
  );

  const toAdd = variables.filter(v => !existingKeys.includes(v.name));

  if (toAdd.length === 0) {
    logger.info("✔ All env variables already exist");
    return;
  }

  // Dry run
  if (dryRun) {
    logger.log("\nUPDATE", filePath);
    logger.log("\nPlanned additions:\n");

    toAdd.forEach(v => {
      logger.log(`  + ${v.name}: ${v.zod}`);
    });

    logger.log("\n✔ No changes applied (dry-run)\n");
    return;
  }

  // Inject variables (with proper formatting)
  const indentMatch = body.match(/\n(\s*)[A-Z0-9_]+\s*:/);
  const indent = indentMatch ? indentMatch[1] : "  ";

  const newLines = toAdd.map(v => `${indent}${v.name}: ${v.zod},`).join("\n");

  const updatedBody =
    body.trimEnd() +
    (body.trimEnd().endsWith(",") ? "\n\n" : ",\n\n") +
    newLines +
    "\n";

  const updatedContent = before + updatedBody + after;

  fs.writeFileSync(filePath, updatedContent);

  logger.break();
  logger.log(highlighter.success(`✔ Updated `) + filePath);
  toAdd.forEach(v => logger.info(` + ${v.name}`));
}
