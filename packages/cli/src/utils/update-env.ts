import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import { highlighter } from "@/utils/highlighter";
import { logger } from "@/utils/logger";
import { spinner } from "@/utils/spinner";

type EnvFileType =
  | ".env"
  | ".env.local"
  | ".env.example"
  | ".env.development.local"
  | ".env.development";

type UpdateEnvProps = {
  envFile: EnvFileType;
  envKeys: string[];
  cwd?: string;
  label: string;
};

export function updateEnvKeys({
  envFile,
  envKeys,
  cwd = process.cwd(),
  label
}: UpdateEnvProps) {
  if (!envKeys.length) return;

  const envFilePath = path.join(cwd, envFile);

  const existing = existsSync(envFilePath)
    ? readFileSync(envFilePath, "utf8")
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

  const newEnvVars = envKeys
    .filter(key => !existingKeys.has(key))
    .map(key => `\n${key}='${key.split("_").join("_").toLowerCase()}'`);

  logger.break();

  if (!newEnvVars.length) {
    logger.log(
      `All env keys already exist in ${highlighter.info(envFile)} — nothing to add`
    );
    return;
  }

  const envSpinner = spinner(
    `Adding ${newEnvVars.length} environment key(s) to ${highlighter.info(envFile)}`
  );
  envSpinner?.start();

  const header = `# ${label} environment variables`;

  const block = `${header}\n` + newEnvVars.join("\n") + "\n";

  const content =
    existing.trim().length > 0 ? `${existing.trim()}\n\n${block}` : block;

  writeFileSync(envFilePath, content, "utf8");

  envSpinner?.succeed(`Env keys added to ${highlighter.info(envFile)}`);
}
