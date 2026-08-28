import path from "node:path";
import { fileURLToPath } from "node:url";
import type { RegistryType } from "@/types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import fs from "node:fs";
import { logger } from "@/utils/logger";
import { GITHUB_URL } from "@/constants/app.constants";

/**
 * Checks if the current runtime is inside the servercn monorepo.
 * Returns true only if both 'packages' and 'apps' directories exist
 * as siblings when walking up from the CLI source.
 */
export function isInMonorepo(): boolean {
  let current = __dirname;
  while (current !== path.parse(current).root) {
    if (
      fs.existsSync(path.join(current, "packages")) &&
      fs.existsSync(path.join(current, "apps"))
    ) {
      return true;
    }
    current = path.join(current, "..");
  }
  return false;
}

/**
 * Resolves the monorepo root directory.
 * It searches upwards for a directory containing 'packages' and 'apps'.
 */
export function getMonorepoRoot() {
  let current = __dirname;
  while (current !== path.parse(current).root) {
    if (
      fs.existsSync(path.join(current, "packages")) &&
      fs.existsSync(path.join(current, "apps"))
    ) {
      return current;
    }
    current = path.join(current, "..");
  }
  // Fallback to current behavior if not found, but scaled correctly for bundled vs src
  return path.resolve(
    __dirname,
    __dirname.includes("dist") ? "../../" : "../../../../"
  );
}

export function resolveTargetDir(folderName: string) {
  const cwd = process.cwd();
  return path.join(cwd, folderName);
}

export const paths = {
  root: getMonorepoRoot(),

  // Registry-build related paths
  registryBase: path.join(getMonorepoRoot(), "packages/registry"),
  templateBase: path.join(getMonorepoRoot(), "packages/templates"),
  outputBase: path.join(getMonorepoRoot(), "apps/web/public/sr"),

  localRegistry: (f?: RegistryType) =>
    path.join(getMonorepoRoot(), "packages/registry", f ? `${f}` : ""),
  remoteRegistry: path.join(
    getMonorepoRoot(),
    "apps/web/public/sr",
    "index.json"
  ),
  templates: () => path.join(getMonorepoRoot(), "packages/templates"),
  targets: (folderName: string) => resolveTargetDir(folderName),

  cliTemplates: ({
    fileName,
    runtime,
    framework,
    architecture
  }: {
    fileName: string;
    runtime: string;
    framework: string;
    architecture: string;
  }) =>
    path.join(
      getMonorepoRoot(),
      `packages/cli/src/templates/${runtime}/${framework}/${architecture}/${fileName}.hbs`
    )
};

/**
 * Asserts that the CLI is running inside the servercn monorepo.
 * Used for maintainer-only features (--local flag, build command).
 * Exits the process with a helpful error message if not in the monorepo.
 */
export function assertMonorepoContext(context?: string) {
  if (!isInMonorepo()) {
    logger.break();
    if (context === "--local") {
      logger.error(
        "The '--local' flag requires running inside the servercn monorepo."
      );
    } else if (context) {
      logger.error(
        `'${context}' requires running inside the servercn monorepo.`
      );
    } else {
      logger.error(
        "This command requires running inside the servercn monorepo."
      );
    }
    logger.break();
    logger.info(
      "This is a development-only feature that reads registry items and templates from disk."
    );
    logger.info("For regular usage, run without '--local':");
    logger.break();
    logger.log("  $ npx servercn-cli@latest init");
    logger.log("  $ npx servercn-cli@latest add <component-name>");
    logger.log("  $ npx servercn-cli@latest list");
    logger.break();
    logger.info(
      `Contributors: clone the monorepo from ${GITHUB_URL} and run commands inside it.`
    );
    logger.break();
    process.exit(1);
  }
}
