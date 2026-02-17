import {
  existsSync,
  readFileSync,
  writeFileSync,
  promises as fs
} from "node:fs";
import path from "node:path";

import {
  findExistingEnvFile,
  getNewEnvKeys,
  mergeEnvContent
} from "@/utils/env-helpers";
import { highlighter } from "@/utils/highlighter";
import { logger } from "@/utils/logger";
import { spinner } from "@/utils/spinner";

export async function updateEnvVars(envKeys?: string[]) {
  if (!envKeys?.length) {
    return;
  }

  const envSpinner = spinner(`Checking environment variables...`);
  envSpinner?.start();

  try {
    const projectRoot = process.cwd();
    const existingEnvFile = findExistingEnvFile(projectRoot);
    const envFilePath = existingEnvFile ?? path.join(projectRoot, ".env");

    const envFileName = path.basename(envFilePath);
    const envFileExists = existsSync(envFilePath);

    const newEnvContent = envKeys.map(key => `${key}=`).join("\n") + "\n";

    let envKeysAdded: string[] = [];

    if (envFileExists) {
      const existingContent = await fs.readFile(envFilePath, "utf-8");
      envKeysAdded = getNewEnvKeys(existingContent, newEnvContent);

      if (envKeysAdded.length > 0) {
        const mergedContent = mergeEnvContent(existingContent, newEnvContent);

        await fs.writeFile(envFilePath, mergedContent, "utf-8");

        logger.break();
        envSpinner?.succeed(`Env keys added to .env:`);

        envKeysAdded.forEach((k, i) => {
          logger.info(` ${i + 1}. ${k}`);
        });

        logger.break();
        logger.log(
          `Add your values for these keys in ${highlighter.info(envFileName)}.`
        );
      } else {
        logger.break();
        envSpinner?.stop();
        logger.log(
          `All env keys already exist in ${highlighter.info(envFileName)} — nothing to add.`
        );
      }
    } else {
      await fs.writeFile(envFilePath, newEnvContent, "utf-8");

      envKeysAdded = [...envKeys];

      envSpinner?.succeed(`Env keys added to .env file:`);

      envKeysAdded.forEach((k, i) => {
        logger.info(` ${i + 1}. ${k}`);
      });

      logger.break();
      logger.log(
        `Add your env values for these keys in ${highlighter.info(".env")} file.`
      );
    }
  } catch (error) {
    envSpinner?.fail(`Failed to update environment variables.`);
    throw error;
  }
}

export function updateEnvExample(envKeys: string[] = [], cwd = process.cwd()) {
  if (!envKeys.length) return;

  const envExamplePath = path.join(cwd, ".env.example");

  const existing = existsSync(envExamplePath)
    ? readFileSync(envExamplePath, "utf8")
    : "";

  const existingKeys = new Set(
    existing
      .split(/\r?\n/)
      .map(line =>
        line
          .replace(/^export\s+/, "")
          .split("=")[0]
          ?.trim()
      )
      .filter(key => key && !key.startsWith("#"))
  );

  const newLines = envKeys
    .filter(key => !existingKeys.has(key))
    .map(key => `\n${key}='${key.split("_").join("_").toLowerCase()}'`);

  logger.break();

  if (!newLines.length) {
    logger.log(
      `All env keys already exist in ${highlighter.info(".env.example")} — nothing to add`
    );
    return;
  }

  const envSpinner = spinner(
    `Adding ${newLines.length} environment key(s) to .env.example`
  );
  envSpinner?.start();

  const header = `\n# ${newLines[0].replaceAll("\n", "").split("=")[0].replaceAll("_", "")}`;
  const block = `${header}\n` + newLines.join("\n") + "\n";

  const content =
    existing.trim().length > 0 ? `${existing.trim()}\n\n${block}` : block;

  writeFileSync(envExamplePath, content, "utf8");

  envSpinner?.succeed(`Env keys added to .env.example`);
}
