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
import { resolveTemplateResolution } from "./add.handlers";
import { execa } from "execa";
import { getExistingEnvFilePath, updateEnvKeys } from "@/utils/update-env";
import { getToolingChoices, getToolingDepsFromChoices } from "@/utils/tooling";
import { SERVERCN_URL } from "@/constants/app.constants";
import { highlighter } from "@/utils/highlighter";
import { injectEnvSchema } from "@/utils/inject-env-schema";
import { mapEnvToZod } from "@/utils/env-helpers";

export async function add(registryItemName: string, options: AddOptions = {}) {
  await assertInitialized();
  validateInput(registryItemName);

  const config = await getServerCNConfig();
  validateStack(config);

  let toolingDeps;
  if (["blueprint"].includes(options?.type || "")) {
    const toolingChoices = await getToolingChoices();
    toolingDeps = getToolingDepsFromChoices(toolingChoices);
  }

  const type: RegistryType = options.type ?? "component";
  const component = await getRegistry(registryItemName, type, options.local);

  validateCompatibility(component, config);

  const resolution = await resolveTemplateResolution({
    component,
    config,
    options,
    registryItemName
  });

  const skipEnvFile = await scaffoldFiles({
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

  if (runtimeDeps.length > 0 || devDeps.length > 0) {
    await installDependencies({
      runtime: runtimeDeps,
      dev: [...(toolingDeps || []), ...devDeps],
      cwd: process.cwd(),
      packageManager: config.packageManager
    });
  }

  await runPostInstallHooks({
    registryItemName,
    skipEnvFile,
    type,
    component,
    framework: config.framework,
    runtime: config.runtime,
    selectedProvider: resolution.selectedProvider ?? "",
    dbEngine: config.database?.engine as DatabaseType,
    dbAdapter: config.database?.adapter as OrmType
  });

  const docs =
    `${SERVERCN_URL}/docs/${config.framework}/${type}s/${registryItemName}` ||
    "";
  logger.break();
  logger.log(
    `${highlighter.success("✔ Added")} ${type}: ${resolution.selectedProvider ? `${component.slug}-${resolution.selectedProvider}` : component.slug}`
  );
  logger.break();
  logger.log(highlighter.create(`→ Docs: ${docs}`));
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
export function validateStack(config: IServerCNConfig) {
  if (!config.runtime || !config.framework) {
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
    const runtime = component.runtimes[config.runtime];

    if (!runtime) {
      logger.error(
        `Runtime ${config.runtime} is not supported by ${component.slug}`
      );
      process.exit(1);
    }

    const framework = runtime.frameworks[config.framework];

    if (!framework) {
      logger.break();
      logger.error(
        `Unsupported framework '${config.framework}' for component '${component.slug}'.`
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

  logger.break();
  logger.log(highlighter.info(`Generating files...`));
  logger.break();

  if (IS_LOCAL) {
    const templateDir = path.resolve(paths.templates(), templatePath);
    if (!(await fs.pathExists(templateDir))) {
      logger.error(
        `\nTemplate not found: ${templateDir}\nCheck your servercn configuration.\n`
      );
      process.exit(1);
    }
    await copyTemplate({
      templateDir,
      targetDir,
      registryItemName,
      conflict: options.force ? "overwrite" : "skip"
    });
  } else {
    const { skipEnvFile, success } = await cloneServercnRegistry({
      component,
      templatePath,
      targetDir,
      options,
      selectedProvider
    });
    if (!success) {
      logger.error("\nSomething went wrong. Failed to scaffold template\n");
      process.exit(1);
    }

    return skipEnvFile;
  }
}

//? Project File Guards
function ensureProjectFiles() {
  ensurePackageJson(process.cwd());
  ensureTsConfig(process.cwd());
}

//? Dependency Resolution
export function resolveDependencies({
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
    component.runtimes[config.runtime].frameworks[config.framework];

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
  skipEnvFile,
  component,
  registryItemName,
  type,
  runtime,
  framework,
  selectedProvider,
  dbEngine,
  dbAdapter
}: {
  skipEnvFile?: string;
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
      if (skipEnvFile) {
        injectEnvSchema({
          filePath: skipEnvFile,
          variables: mapEnvToZod(filterEnvs)
        });
      }
      updateEnvKeys({
        envFile: ".env.example",
        envKeys: filterEnvs,
        label: registryItemName
      });

      const envFile = getExistingEnvFilePath();
      updateEnvKeys({
        envFile,
        envKeys: filterEnvs,
        label: registryItemName
      });
    }
  }
}
