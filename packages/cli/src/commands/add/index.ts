import fs from "fs-extra";
import path from "node:path";
import { cloneServercnRegistry, copyTemplate } from "@/lib/copy";
import { getRegistry } from "@/lib/registry";
import { installDependencies } from "@/lib/install-deps";
import { ensurePackageJson, ensureTsConfig } from "@/lib/package";
import { logger } from "@/utils/logger";
import { assertInitialized } from "@/lib/assert-initialized";
import { getServerCNConfig } from "@/lib/config";
import { paths } from "@/lib/paths";
import type {
  AddOptions,
  DatabaseType,
  FrameworkType,
  IServerCNConfig,
  OrmType,
  RegistryItem,
  RegistryMap,
  RegistryType,
  RuntimeType
} from "@/types";
import { capitalize } from "@/utils/capitalize";
import { resolveTemplateResolution } from "./add.handlers";
import { spinner } from "@/utils/spinner";
import { execa } from "execa";
import { updateEnvKeys } from "@/utils/update-env";

export async function add(registryItemName: string, options: AddOptions = {}) {
  validateInput(registryItemName);

  const config = await getServerCNConfig();
  validateStack(config);

  const type: RegistryType = options.type ?? "component";
  const component = await getRegistry(registryItemName, type, options.local);

  await assertInitialized();

  validateCompatibility(component, config);

  const resolution = await resolveTemplateResolution({
    component,
    config,
    options,
    registryItemName
  });

  await scaffoldFiles({
    registryItemName,
    templatePath: resolution.templatePath,
    options,
    component,
    selectedProvider: resolution.selectedProvider
  });

  ensureProjectFiles();

  const { runtimeDeps, devDeps } = resolveDependencies({
    component,
    config,
    additionalRuntimeDeps: resolution.additionalRuntimeDeps,
    additionalDevDeps: resolution.additionalDevDeps
  });

  await installDependencies({
    runtime: runtimeDeps,
    dev: devDeps,
    cwd: process.cwd(),
    packageManager: config.project.packageManager
  });

  await runPostInstallHooks({
    registryItemName,
    type,
    component,
    framework: config.stack.framework,
    runtime: config.stack.runtime,
    selectedProvider: resolution.selectedProvider ?? "",
    dbEngine: config.database?.engine as DatabaseType,
    dbAdapter: config.database?.adapter as OrmType
  });

  logger.break();
  logger.success(`${capitalize(type)}: ${component.slug} added successfully`);
  logger.break();
}

//? Input Validation
function validateInput(name: string) {
  if (!name) {
    logger.error("Component name is required.");
    process.exit(1);
  }
}

//? Stack Validation
function validateStack(config: IServerCNConfig) {
  if (!config.stack.runtime || !config.stack.framework) {
    logger.error(
      "Stack configuration is missing. Run `npx servercn-cli init` first."
    );
    process.exit(1);
  }
}

//? Compatibility Validation (Runtime-aware)
function validateCompatibility(
  component: RegistryMap[RegistryType],
  config: IServerCNConfig
) {
  if ("runtimes" in component) {
    const runtime = component.runtimes[config.stack.runtime];

    if (!runtime) {
      logger.error(
        `Runtime ${config.stack.runtime} is not supported by ${component.slug}`
      );
      process.exit(1);
    }

    const framework = runtime.frameworks[config.stack.framework];

    if (!framework) {
      logger.break();
      logger.error(
        `Unsupported framework '${config.stack.framework}' for component '${component.slug}'.`
      );
      logger.error(
        `This '${component.slug}' does not provide templates for the selected framework.`
      );
      logger.error(
        `Please choose one of the supported frameworks and try again.`
      );
      logger.break();
      process.exit(1);
    }
  }
}

//? Scaffolding Layer
export async function scaffoldFiles({
  registryItemName,
  templatePath,
  options,
  component,
  selectedProvider
}: {
  registryItemName: string;
  templatePath: string;
  options: AddOptions;
  component: RegistryItem;
  selectedProvider?: string;
}) {
  const IS_LOCAL = options.local ?? false;
  const targetDir = paths.targets(".");

  const spin = spinner("Scaffolding files...")?.start();

  if (IS_LOCAL) {
    const templateDir = path.resolve(paths.templates(), templatePath);
    if (!(await fs.pathExists(templateDir))) {
      logger.error(
        `\nTemplate not found: ${templateDir}\nCheck your servercn configuration.\n`
      );
      process.exit(1);
    }
    logger.break();

    await copyTemplate({
      templateDir,
      targetDir,
      registryItemName,
      conflict: options.force ? "overwrite" : "skip"
    });
  } else {
    const ok = await cloneServercnRegistry({
      component,
      templatePath,
      targetDir,
      options,
      selectedProvider
    });
    if (!ok) {
      logger.error("\nSomething went wrong. Failed to scaffold template\n");
      process.exit(1);
    }
  }

  logger.break();
  spin?.succeed("Scaffolding files successfully!");
}

//? Project File Guards
function ensureProjectFiles() {
  ensurePackageJson(process.cwd());
  ensureTsConfig(process.cwd());
}

//? Dependency Resolution
function resolveDependencies({
  component,
  config,
  additionalDevDeps,
  additionalRuntimeDeps
}: {
  component: RegistryItem;
  config: IServerCNConfig;
  additionalRuntimeDeps: string[];
  additionalDevDeps: string[];
}) {
  // TOOLING (no runtimes)
  if (!("runtimes" in component)) {
    return {
      runtimeDeps: [
        ...(component.dependencies?.runtime ?? []),
        ...additionalRuntimeDeps
      ],
      devDeps: [...(component.dependencies?.dev ?? []), ...additionalDevDeps]
    };
  }

  // RUNTIME-BASED ITEMS
  const framework =
    component.runtimes[config.stack.runtime].frameworks[config.stack.framework];

  return {
    runtimeDeps: [
      ...(framework && "dependencies" in framework
        ? (framework.dependencies?.runtime ?? [])
        : []),
      ...additionalRuntimeDeps
    ],
    devDeps: [
      ...(framework && "dependencies" in framework
        ? (framework?.dependencies?.dev ?? [])
        : []),
      ...additionalDevDeps
    ]
  };
}

//? Post Install Hooks
async function runPostInstallHooks({
  component,
  registryItemName,
  type,
  runtime,
  framework,
  selectedProvider,
  dbEngine,
  dbAdapter
}: {
  registryItemName: string;
  selectedProvider: string;
  type: RegistryType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: any;
  runtime: RuntimeType;
  framework: FrameworkType;
  dbEngine: DatabaseType;
  dbAdapter: OrmType;
}) {
  if (type === "tooling" && registryItemName === "husky") {
    try {
      await execa("npx", ["husky", "init"], { stdio: "inherit" });
    } catch {
      logger.warn(
        "Could not initialize husky automatically. Please run 'npx husky init' manually."
      );
    }
  } else {
    let filterEnvs: Array<string> = [];
    switch (type) {
      case "component":
        const registry = component?.runtimes[runtime]?.frameworks[framework];

        if (registry?.prompt) {
          filterEnvs = registry?.variants[selectedProvider]?.env?.filter(
            (env: string) => env !== ""
          );
        } else {
          filterEnvs = registry?.env?.filter((env: string) => env !== "");
        }

        break;

      case "blueprint":
        const registryBlueprint =
          component?.runtimes[runtime]?.frameworks[framework]?.databases[
            dbEngine
          ].orms[dbAdapter]?.env ?? [];
        filterEnvs = registryBlueprint?.filter((env: string) => env !== "");
        break;

      default:
        break;
    }

    if (filterEnvs?.length > 0) {
      updateEnvKeys({
        envFile: ".env.example",
        envKeys: filterEnvs,
        label: registryItemName
      });
      updateEnvKeys({
        envFile: ".env",
        envKeys: filterEnvs,
        label: registryItemName
      });
    }
  }
}
