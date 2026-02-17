import path from "node:path";
import prompts from "prompts";
import { execa } from "execa";
import { cloneRegistryTemplate } from "@/lib/copy";
import { getRegistryComponent } from "@/lib/registry";
import { installDependencies } from "@/lib/install-deps";
import { ensurePackageJson, ensureTsConfig } from "@/lib/package";
import { logger } from "@/utils/logger";
import { assertInitialized } from "@/lib/assert-initialized";
import { getServerCNConfig } from "@/lib/config";
import { paths } from "@/lib/paths";
import type {
  AddOptions,
  DatabaseType,
  DependencySet,
  FrameworkType,
  IBlueprint,
  ISchema,
  IServerCNConfig,
  OrmType,
  RegistryItem,
  RegistryType
} from "@/types";
import { capitalize } from "@/utils/capitalize";
import { spinner } from "@/utils/spinner";
import { updateEnvExample, updateEnvVars } from "@/utils/update-env-vars";

export async function add(componentName: string, options: AddOptions = {}) {
  if (!componentName) {
    logger.error("Component name is required.");
    process.exit(1);
  }

  const type: RegistryType = options.type ?? "component";

  let component: RegistryItem;
  if (type === "blueprint") {
    component = await getRegistryComponent(componentName, type);
  } else {
    component = await getRegistryComponent(componentName, type);
  }

  await assertInitialized();
  const config = await getServerCNConfig();

  if (!component.stacks.includes(config.stack.framework)) {
    logger.error(
      `${capitalize(type)} '${componentName}' does not support '${config.stack.framework}'.`
    );
    process.exit(1);
  }

  if (!component.architectures.includes(config.stack.architecture)) {
    logger.error(
      `${capitalize(type)} '${componentName}' does not support '${config.stack.architecture}'.`
    );
    process.exit(1);
  }

  const { templatePath, additionalRuntimeDeps, additionalDevDeps } =
    await resolveTemplateResolution(component, config, options);

  const templateDir = path.resolve(paths.templates(), templatePath);
  const targetDir = paths.targets(".");

  logger.break();
  const result = spinner("Scaffolding files...")?.start();
  // await copyTemplate({
  //   templateDir,
  //   targetDir,
  //   componentName,
  //   conflict: options.force ? "overwrite" : "skip",
  //   dryRun: options.dryRun
  // });

  await cloneRegistryTemplate({
    targetDir: targetDir,
    templateDir: templatePath,
    force: options.force
  });

  logger.break();
  result.succeed("Scaffolding files successfully!");

  ensurePackageJson(process.cwd());
  ensureTsConfig(process.cwd());

  const runtimeDeps = [
    ...((component.dependencies?.runtime ?? []) as string[]),
    ...additionalRuntimeDeps
  ];
  const devDeps = [
    ...((component.dependencies?.dev ?? []) as string[]),
    ...additionalDevDeps
  ];

  await installDependencies({
    runtime: runtimeDeps,
    dev: devDeps,
    cwd: process.cwd()
  });

  await runPostInstallHooks(componentName, type, component);

  logger.success(
    `\n${capitalize(type)}: ${component.slug} added successfully\n`
  );
}

async function resolveTemplateResolution(
  component: any,
  config: IServerCNConfig,
  options: AddOptions
): Promise<{
  templatePath: string;
  additionalRuntimeDeps: string[];
  additionalDevDeps: string[];
}> {
  const type = component.type as RegistryType;
  const framework = config.stack.framework;
  const architecture = config.stack.architecture;
  if (component?.algorithms && type !== "schema") {
    return resolveAlgorithmChoice(component, architecture);
  }

  const templateConfig = component.templates?.[framework];
  if (!templateConfig) {
    logger.error(
      `Framework '${framework}' is not supported by '${component.title.toLowerCase()}'.`
    );
    process.exit(1);
  }

  let selectedPath: string | undefined;

  switch (type) {
    case "schema":
      selectedPath = resolveDatabaseTemplate(
        templateConfig,
        config,
        architecture,
        options,
        component.slug
      );

      if (selectedPath) {
        const schemaDeps = resolveDependencies(
          component as ISchema,
          framework,
          config.database?.type as DatabaseType,
          config.database?.orm as OrmType
        );
        return {
          templatePath: selectedPath,
          additionalRuntimeDeps: schemaDeps.runtime,
          additionalDevDeps: schemaDeps.dev
        };
      }
      break;
    case "blueprint":
      selectedPath = resolveDatabaseTemplate(
        templateConfig,
        config,
        architecture,
        options,
        component.slug
      );

      if (type === "blueprint" && selectedPath) {
        const result = spinner("Installing Dependencies").start();
        const blueprintDeps = resolveDependencies(
          component as IBlueprint,
          framework,
          config.database?.type as DatabaseType,
          config.database?.orm as OrmType
        );
        result.succeed();
        return {
          templatePath: selectedPath,
          additionalRuntimeDeps: blueprintDeps.runtime,
          additionalDevDeps: blueprintDeps.dev
        };
      }
      break;

    case "tooling":
      selectedPath = templateConfig[architecture];
      break;

    default:
      selectedPath =
        typeof templateConfig === "string"
          ? templateConfig
          : templateConfig[architecture];
      break;
  }

  if (!selectedPath) {
    logger.error(
      `Architecture '${architecture}' is not supported for ${type} '${component.slug}'.`
    );
    process.exit(1);
  }

  return {
    templatePath: selectedPath,
    additionalRuntimeDeps: [],
    additionalDevDeps: []
  };
}

function resolveDatabaseTemplate(
  templateConfig: any,
  config: IServerCNConfig,
  architecture: string,
  options: AddOptions,
  slug: string
): string | undefined {
  const dbType = config.database?.type;
  const orm = config.database?.orm;

  if (!dbType || !orm) {
    logger.error(
      "Database or ORM not configured. Please run 'servercn init' first."
    );
    process.exit(1);
  }

  const dbConfig = templateConfig[dbType];
  if (!dbConfig || !dbConfig[orm]) {
    logger.error(
      `Database stack "${dbType}-${orm}" is not supported by "${slug}".`
    );
    process.exit(1);
  }

  const archOptions = dbConfig[orm];
  const selectedConfig = archOptions[architecture] ?? archOptions.base;

  if (!selectedConfig) return undefined;

  // Handle variants (e.g., minimal vs advanced) if they exist
  const variant = options.variant || "advanced";
  return typeof selectedConfig === "string"
    ? selectedConfig
    : selectedConfig[variant];
}

async function resolveAlgorithmChoice(
  component: any,
  architecture: string
): Promise<{
  templatePath: string;
  additionalRuntimeDeps: string[];
  additionalDevDeps: string[];
}> {
  const choices = Object.entries(component.algorithms).map(
    ([key, value]: any) => ({
      title: value.title,
      value: key
    })
  );

  const { algorithm } = await prompts({
    type: "select",
    name: "algorithm",
    message: "Select implementation algorithm:",
    choices
  });

  if (!algorithm) {
    logger.warn("Operation cancelled.");
    process.exit(0);
  }

  const algoConfig = component.algorithms[algorithm];
  const selectedTemplate =
    algoConfig.templates?.[architecture] ?? algoConfig.templates?.base;

  if (!selectedTemplate) {
    logger.error(
      `Architecture "${architecture}" is not supported for algorithm "${algorithm}".`
    );
    process.exit(1);
  }

  return {
    templatePath: selectedTemplate,
    additionalRuntimeDeps: algoConfig.dependencies?.runtime ?? [],
    additionalDevDeps: algoConfig.dependencies?.dev ?? []
  };
}

async function runPostInstallHooks(
  componentName: string,
  type: RegistryType,
  component: any
) {
  if (type === "tooling" && componentName === "husky") {
    try {
      await execa("npx", ["husky", "init"], { stdio: "inherit" });
    } catch (error) {
      logger.warn(
        "Could not initialize husky automatically. Please run 'npx husky init' manually."
      );
    }
  }

  if (component.env?.length) {
    updateEnvExample(component.env, process.cwd());
    await updateEnvVars(component.env);
  }
}

function resolveDependencies(
  component: IBlueprint | ISchema,
  framework: FrameworkType,
  db: DatabaseType,
  orm: OrmType
): DependencySet {
  const sets = component.dependencies;

  const relevantKeys = [
    "common",
    `stack:${framework}`,
    `db:${db}`,
    `orm:${orm}`
  ];

  return relevantKeys.reduce<DependencySet>(
    (acc, key) => {
      const set = sets[key];
      if (set) {
        acc.runtime.push(...(set.runtime || []));
        acc.dev.push(...(set.dev || []));
      }
      return acc;
    },
    { runtime: [], dev: [] }
  );
}
