import fs from "fs-extra";
import path from "path";
import { logger } from "../utils/cli-logger";
import type { CopyOptions } from "../types";

export type ConflictStrategy = "skip" | "overwrite" | "error";

export async function copyTemplate({
  templateDir,
  targetDir,
  componentName,
  conflict = "skip",
  dryRun = false,
}: CopyOptions) {
 
  if (!(await fs.pathExists(templateDir))) {
    logger.error(`Template not found: ${templateDir}`);
    process.exit(1);
  }

  await fs.ensureDir(targetDir);

  const entries = await fs.readdir(templateDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(templateDir, entry.name);

    let rawName = entry.name === "_gitignore" ? ".gitignore" : entry.name;

    let finalName = rawName;

    const destPath = path.join(targetDir, finalName);

    if (entry.isDirectory()) {
      await copyTemplate({
        templateDir: srcPath,
        targetDir: destPath,
        componentName,
        conflict,
        dryRun,
      });
      continue;
    }

    const exists = await fs.pathExists(destPath);

    if (exists) {
      if (conflict === "skip") {
      
        logger.warn(`Skipped: ${destPath}`);
        continue;
      }
      if (conflict === "error") {
        throw new Error(`File already exists: ${destPath}`);
      }
    }

    if (dryRun) {
      logger.info(`[dry-run] ${exists ? "Overwrite" : "Create"}: ${destPath}`);
      continue;
    }

    const buffer = await fs.readFile(srcPath);
    const isBinary = buffer.includes(0);

    await fs.ensureDir(path.dirname(destPath));

    if (isBinary) {
      await fs.copyFile(srcPath, destPath);
    } else {
      let content = buffer.toString("utf8");

      await fs.writeFile(destPath, content);
    }

    logger.created(
      exists ? `Overwritten: ${destPath}` : `: ${destPath}`
    );
  }
}
