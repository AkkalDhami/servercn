import path from "node:path";
import { fileURLToPath } from "node:url";
import type { RegistryType } from "@/types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import fs from "node:fs";

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
