import fs from "fs-extra";
import path from "node:path";
import { logger } from "@/utils/logger";
import type { CopyOptions } from "@/types";

export async function copyTemplate({
  templateDir,
  targetDir,
  registryItemName,
  conflict = "skip",
  dryRun = false
}: CopyOptions) {
  await fs.ensureDir(targetDir);

  const entries = await fs.readdir(templateDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(templateDir, entry.name);

    const rawName = entry.name === "_gitignore" ? ".gitignore" : entry.name;

    const finalName = rawName;
    const destPath = path.join(targetDir, finalName);
    const relativeDestPath = path.relative(process.cwd(), destPath);
    if (entry.isDirectory()) {
      await copyTemplate({
        templateDir: srcPath,
        targetDir: destPath,
        registryItemName,
        conflict,
        dryRun
      });
      continue;
    }

    const exists = await fs.pathExists(destPath);

    if (exists) {
      if (conflict === "skip") {
        logger.skip(relativeDestPath);
        continue;
      }
      if (conflict === "error") {
        throw new Error(`File already exists: ${relativeDestPath}`);
      }
    }

    if (dryRun) {
      logger.info(
        `[dry-run] ${exists ? "overwrite" : "create"}: ${relativeDestPath}`
      );
      continue;
    }

    const buffer = await fs.readFile(srcPath);
    const isBinary = buffer.includes(0);

    await fs.ensureDir(path.dirname(destPath));

    if (isBinary) {
      await fs.copyFile(srcPath, destPath);
    } else {
      const content = buffer.toString("utf8");

      await fs.writeFile(destPath, content);
    }

    if (exists) {
      logger.overwrite(relativeDestPath);
    } else {
      logger.create(relativeDestPath);
    }
  }
}
