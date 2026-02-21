import fs from "fs-extra";
import path from "node:path";
import { cloneRegistryTemplate, copyTemplate } from "@/lib/copy";
import { getRegistry } from "@/lib/registry";
import { installDependencies } from "@/lib/install-deps";
import { ensurePackageJson, ensureTsConfig } from "@/lib/package";
import { logger } from "@/utils/logger";
import { assertInitialized } from "@/lib/assert-initialized";
import { getServerCNConfig } from "@/lib/config";
import { paths } from "@/lib/paths";
import type {
  AddOptions,
  IServerCNConfig,
  RegistryItem,
  RegistryMap,
  RegistryType,
} from "@/types";
import { capitalize } from "@/utils/capitalize";
import { resolveTemplateResolution, runPostInstallHooks } from "./add.handlers";
import { spinner } from "@/utils/spinner";

export async function add(
  registryItemName: string,
  options: AddOptions = {}
) {
  validateInput(registryItemName);

  const config = await getServerCNConfig();
  validateStack(config);

  const type: RegistryType = options.type ?? "component";
  const component = await getRegistry(registryItemName, type);

  await assertInitialized();

  validateCompatibility(component, config);

  const resolution = await resolveTemplateResolution({
    component,
    config,
    options,
    registryItemName
  });

  await scaffoldFiles(registryItemName, resolution.templatePath, options);

  ensureProjectFiles();

  const { runtimeDeps, devDeps } = resolveDependencies(
    component,
    config,
    resolution.additionalRuntimeDeps,
    resolution.additionalDevDeps
  );

  await installDependencies({
    runtime: runtimeDeps,
    dev: devDeps,
    cwd: process.cwd()
  });

  await runPostInstallHooks({
    registryItemName,
    type,
    component,
    framework: config.stack.framework,
    runtime: config.stack.runtime,
    selectedProvider: resolution.selectedProvider ?? ""
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
    logger.error("Stack configuration is missing. Run `npx servercn-cli init` first.");
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
      logger.error(`Please choose one of the supported frameworks and try again.`);
      logger.break();
      process.exit(1);
    }

  }
}

//? Scaffolding Layer
export async function scaffoldFiles(
  registryItemName: string,
  templatePath: string,
  options: AddOptions
) {
  const IS_TESTING = options.local ?? false;
  const targetDir = paths.targets(".");

 
  const spin = spinner("Scaffolding files...")?.start();

  if (IS_TESTING) {
    const templateDir = path.resolve(paths.templates(), templatePath);
    if (!(await fs.pathExists(templateDir))) {
      logger.error(`Template not found: ${templateDir}`);
      process.exit(1);
    }

    await copyTemplate({
      templateDir,
      targetDir,
      registryItemName,
      conflict: options.force ? "overwrite" : "skip",
      dryRun: options.force
    });
  } else {
    await cloneRegistryTemplate({
      targetDir,
      templateDir: templatePath,
      force: options.force
    });
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
function resolveDependencies(
  component: RegistryItem,
  config: IServerCNConfig,
  additionalRuntimeDeps: string[],
  additionalDevDeps: string[]
) {
  // TOOLING (no runtimes)
  if (!("runtimes" in component)) {
    return {
      runtimeDeps: [
        ...(component.dependencies?.runtime ?? []),
        ...additionalRuntimeDeps
      ],
      devDeps: [
        ...(component.dependencies?.dev ?? []),
        ...additionalDevDeps
      ]
    };
  }

  // RUNTIME-BASED ITEMS
  const framework =
    component.runtimes[config.stack.runtime].frameworks[
    config.stack.framework
    ]

  return {
    runtimeDeps: [
      ...(framework && 'dependencies' in framework ? framework.dependencies?.runtime ?? [] : []),
      ...additionalRuntimeDeps
    ],
    devDeps: [
      ...(framework && 'dependencies' in framework ? framework?.dependencies?.dev ?? [] : []),
      ...additionalDevDeps
    ]
  };
}