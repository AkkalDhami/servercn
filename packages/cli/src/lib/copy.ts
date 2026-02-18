import fs from "fs-extra";
import path from "node:path";
import os from "node:os";
import { logger } from "@/utils/logger";
import type { CopyOptions } from "@/types";
import { downloadTemplate } from "giget";
import { GITHUB_BASE_URL } from "@/constants/app.constants";

export async function copyTemplate({
  templateDir,
  targetDir,
  componentName,
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
        componentName,
        conflict,
        dryRun
      });
      continue;
    }

    const exists = await fs.pathExists(destPath);

    if (exists) {
      if (conflict === "skip") {
        logger.warn(`Skip: ${relativeDestPath} (already exists)`);
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

    exists
      ? logger.warn(`Skip: ${relativeDestPath}`)
      : logger.created(`${relativeDestPath}`);
  }
}

async function mergeDirectory({
  srcDir,
  destDir,
  force
}: {
  srcDir: string;
  destDir: string;
  force: boolean;
}) {
  await fs.ensureDir(destDir);

  const entries = await fs.readdir(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      //directories are never a conflict
      await mergeDirectory({
        srcDir: srcPath,
        destDir: destPath,
        force
      });
      continue;
    }

    const exists = await fs.pathExists(destPath);

    if (exists && !force) {
      logger.warn(`Skip: ${path.relative(process.cwd(), destPath)}`);
      continue;
    }

    await fs.ensureDir(path.dirname(destPath));
    await fs.copy(srcPath, destPath, { overwrite: force });

    logger.created(path.relative(process.cwd(), destPath));
  }
}

export async function cloneRegistryTemplate({
  targetDir,
  templateDir,
  force = false
}: {
  targetDir: string;
  templateDir: string;
  force?: boolean;
}) {
  const cwd = process.cwd();
  const targetPath = path.resolve(cwd, targetDir);

  await fs.ensureDir(targetPath);

  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "servercn-"));

  try {
    const templateSource = `${GITHUB_BASE_URL}/${templateDir}`;
    // console.log({ targetDir, templateDir, templateSource });

    const s = await downloadTemplate(templateSource, {
      dir: targetPath,
      force: true
    });

    // console.log({ s });

    await mergeDirectory({
      srcDir: tempDir,
      destDir: targetPath,
      force
    });
  } catch (e) {
    throw new Error("Repository not found on GitHub");
  } finally {
    await fs.remove(tempDir);
  }
}
