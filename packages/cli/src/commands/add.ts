import path from "node:path";
import prompts from "prompts";
import { execa } from "execa";
import { copyTemplate } from "../lib/copy";
import { getRegistryComponent } from "../lib/registry";
import { resolveTargetDir } from "../lib/architecture";
import { installDependencies } from "../lib/install-deps";
import { updateEnvExample } from "../lib/env";
import { ensurePackageJson, ensureTsConfig } from "../lib/package";
import { logger } from "../utils/logger";
import { assertInitialized } from "../lib/assert-initialized";
import { getServerCNConfig } from "../lib/config";
import { paths } from "../lib/paths";
import type { AddOptions, RegistryType, ServerCNConfig } from "../types";

export async function add(componentName: string, options: AddOptions = {}) {
  if (!componentName) {
    logger.error("Component name is required.");
    process.exit(1);
  }

  const type: RegistryType = options.type ?? "component";

  const component = await getRegistryComponent(componentName, type);

  await assertInitialized();
  const config = await getServerCNConfig();

  if (!component.stacks.includes(config.stack.framework)) {
    logger.error(
      `${type.charAt(0).toUpperCase() + type.slice(1)} "${componentName}" does not support "${config.stack.framework}".`
    );
    process.exit(1);
  }

  const { templatePath, additionalRuntimeDeps } =
    await resolveTemplateResolution(component, config, options);

  const templateDir = path.resolve(paths.templates(), templatePath);
  const targetDir = resolveTargetDir(".");

  logger.section("Copying files");
  await copyTemplate({
    templateDir,
    targetDir,
    componentName,
    conflict: options.force ? "overwrite" : "skip",
    dryRun: options.dryRun
  });

  ensurePackageJson(process.cwd());
  ensureTsConfig(process.cwd());

  const runtimeDeps = [
    ...(component.dependencies?.runtime ?? []),
    ...additionalRuntimeDeps
  ];
  const devDeps = component.dependencies?.dev ?? [];

  await installDependencies({
    runtime: runtimeDeps,
    dev: devDeps,
    cwd: process.cwd()
  });

  await runPostInstallHooks(componentName, type, component);

  logger.success(`${type}: ${component.slug} added successfully\n`);
}

/**
 * Orchestrates the resolution of template paths based on project configuration and component type.
 */
async function resolveTemplateResolution(
  component: any,
  config: ServerCNConfig,
  options: AddOptions
): Promise<{ templatePath: string; additionalRuntimeDeps: string[] }> {
  const type = component.type as RegistryType;
  const framework = config.stack.framework;
  const architecture = config.stack.architecture;

  // Handle Components with multiple implementation algorithms (e.g., password-hashing)
  if (component.algorithms && type !== "schema") {
    return resolveAlgorithmChoice(component, architecture);
  }

  const templateConfig = component.templates?.[framework];
  if (!templateConfig) {
    logger.error(
      `Framework "${framework}" is not supported by "${component.title}".`
    );
    process.exit(1);
  }

  let selectedPath: string | undefined;

  switch (type) {
    case "schema":
    case "blueprint":
      // Complex resolution based on Database and ORM
      selectedPath = resolveDatabaseTemplate(
        templateConfig,
        config,
        architecture,
        options,
        component.slug
      );
      break;

    case "tooling":
      // Direct resolution by architecture
      selectedPath = templateConfig[architecture];
      break;

    default:
      // Standard component resolution: try architecture-specific, then fallback to base string
      selectedPath =
        typeof templateConfig === "string"
          ? templateConfig
          : templateConfig[architecture];
      break;
  }

  if (!selectedPath) {
    logger.error(
      `Architecture "${architecture}" is not supported for ${type} "${component.slug}".`
    );
    process.exit(1);
  }

  return { templatePath: selectedPath, additionalRuntimeDeps: [] };
}

/**
 * Resolves templates that depend on the project's database and ORM configuration.
 */
function resolveDatabaseTemplate(
  templateConfig: any,
  config: ServerCNConfig,
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

/**
 * Handles interactive selection for components that offer multiple algorithms.
 */
async function resolveAlgorithmChoice(
  component: any,
  architecture: string
): Promise<{ templatePath: string; additionalRuntimeDeps: string[] }> {
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
    additionalRuntimeDeps: algoConfig.dependencies?.runtime ?? []
  };
}

/**
 * Executes post-installation tasks like initializing husky or updating .env.example.
 */
async function runPostInstallHooks(
  componentName: string,
  type: RegistryType,
  component: any
) {
  // Edge case: Husky requires a specialized init command
  if (type === "tooling" && componentName === "husky") {
    try {
      await execa("npx", ["husky", "init"], { stdio: "inherit" });
    } catch (error) {
      logger.warn(
        "Could not initialize husky automatically. Please run 'npx husky init' manually."
      );
    }
  }

  // Update .env.example if the component defines environment variables
  if (component.env?.length) {
    updateEnvExample(component.env, process.cwd());
  }
}
