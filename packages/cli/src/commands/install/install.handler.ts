import { getServerCNConfig } from "@/lib/config";
import { logger } from "@/utils/logger";
import { resolveDependencies, validateStack } from "../add";
import { getRegistry } from "@/lib/registry";
import type { RegistryType } from "@/types";
import { resolveTemplateResolution } from "../add/add.handlers";
import { clean, installDependencies } from "@/lib/install-deps";

export type InstallMode = "all" | "dev-only" | "deps-only";

export type InstallOptions = {
  type: string;
  name: string;
  mode: InstallMode;
};

export function resolveInstallMode(options: {
  devOnly?: boolean;
  depsOnly?: boolean;
}): InstallMode {
  if (options.devOnly) {
    return "dev-only";
  } else if (options.depsOnly) {
    return "deps-only";
  } else {
    return "all";
  }
}

function resolveRegistryType(type: string): RegistryType {
  const typeMap: Record<string, string> = {
    sc: "schema",
    bp: "blueprint",
    tl: "tooling",
    pr: "provider",
    cp: "component",
    fd: "foundation"
  };
  return (typeMap[type] as RegistryType) || (type as RegistryType);
}

export async function installRegistryItemDeps(options: InstallOptions) {
  const type = resolveRegistryType(options.type);
  const typeLabel = type;

  try {
    const config = await getServerCNConfig();
    validateStack(config);

    const item = await getRegistry(options.name, type, false);

    const resolution = await resolveTemplateResolution({
      component: item,
      config,
      options: {
        arch: config.architecture,
        type,
        force: false
      },
      registryItemName: options.name
    });

    const { runtimeDeps, devDeps } = resolveDependencies({
      component: item,
      config,
      additionalRuntimeDeps: resolution.additionalRuntimeDeps,
      additionalDevDeps: resolution.additionalDevDeps
    });

    const deps = [...new Set(clean(runtimeDeps))];
    const dev = [...new Set(clean(devDeps))];

    if (deps.length === 0 && dev.length === 0) {
      logger.info(
        `No dependencies to install for ${typeLabel} '${options.name}'.`
      );
      return;
    }

    let runtime: string[] = [];
    let devInstall: string[] = [];

    if (options.mode === "dev-only") {
      if (dev.length === 0) {
        logger.info(
          `No dev dependencies to install for ${typeLabel} '${options.name}'.`
        );
        return;
      }

      runtime = [];
      devInstall = dev;
    } else if (options.mode === "deps-only") {
      if (deps.length === 0) {
        logger.info(
          `No runtime dependencies to install for ${typeLabel} '${options.name}'.`
        );
        return;
      }

      runtime = deps;
      devInstall = [];
    } else {
      runtime = deps;
      devInstall = dev;
    }

    await installDependencies({
      runtime,
      dev: devInstall,
      cwd: process.cwd(),
      packageManager: config.packageManager
    });
  } catch (error) {
    logger.error(
      `Failed to install dependencies for ${typeLabel} '${options.name}': ${error}`
    );
    throw error;
  }
}
