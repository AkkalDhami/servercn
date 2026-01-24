import path from "path";
import prompts from "prompts";

import { getTemplatesPath } from "../lib/paths";
import { copyTemplate } from "../lib/copy";
import { getRegistryComponent } from "../lib/registry";
import { resolveTargetDir } from "../lib/architecture";
import { installDependencies } from "../lib/install-deps";
import { updateEnvExample } from "../lib/env";
import { ensurePackageJson, ensureTsConfig } from "../lib/package";
import { logger } from "../utils/cli-logger";
import { assertInitialized } from "../lib/assert-initialized";
import { getServerCNConfig } from "../lib/config";
import type { AddOptions } from "../types";
import { capitalize } from "../utils/capatalize";

export async function add(componentName: string, options: AddOptions = {}) {
  await assertInitialized();

  const config = await getServerCNConfig();

  const type = options.type ?? "component";

  const component = await getRegistryComponent(componentName, type);

  if (!component.stacks.includes(config.stack.framework)) {
    logger.error(
      `${type === "schema" ? "Schema" : "Component"} "${componentName}" does not support "${config.stack.framework}"`
    );

    process.exit(1);
  }

  const stack = config.stack.framework;
  const arch = config.stack.architecture;

  const targetDir = resolveTargetDir(".");

  if (!targetDir) {
    logger.error("Failed to resolve target directory");
    process.exit(1);
  }

  let templateDir: string;
  let runtimeDeps: string[] | undefined;
  const devDeps = component.dependencies?.dev;
  if (component.algorithms && type !== "schema") {
    const choices = Object.entries(component.algorithms).map(
      ([key, value]: any) => ({
        title: value.title,
        value: key
      })
    );

    const { algorithm } = await prompts({
      type: "select",
      name: "algorithm",
      message: "Select implementation",
      choices
    });

    if (!algorithm) {
      logger.warn("Operation cancelled");
      return;
    }

    const algoConfig = component.algorithms[algorithm];

    const selectedTemplate =
      algoConfig.templates?.[arch] ?? algoConfig.templates?.base;

    if (!selectedTemplate) {
      logger.error(
        `Architecture "${arch}" is not supported for "${component.title}"`
      );
      process.exit(1);
    }

    templateDir = path.resolve(getTemplatesPath(), selectedTemplate);
    runtimeDeps = algoConfig.dependencies?.runtime;

    logger.info(`Using algorithm: ${algoConfig.title}`);
  } else {
    const templateConfig = component.templates?.[stack];

    if (!templateConfig) {
      logger.error(`Stack "${stack}" is not supported by "${component.title}"`);
      process.exit(1);
    }

    let selectedTemplate: string | undefined;

    if (type === "schema") {
      const database = config.database?.type;
      const databaseOrm = config.database?.orm;
      if (!database || !databaseOrm) {
        logger.error(
          "Database not configured in servercn.config.json. Please run init first."
        );
        process.exit(1);
      }

      const dbConfig = (templateConfig as any)[database];
      if (!dbConfig || !dbConfig[databaseOrm]) {
        logger.error(
          `Database "${database}-${databaseOrm}" is not supported by "${component.slug}"`
        );
        process.exit(1);
      }
      const dbArchOptions = dbConfig[databaseOrm];

      const archConfig = dbArchOptions[arch] ?? dbArchOptions.base;

      if (!archConfig) {
        logger.error(
          `Architecture "${arch}" is not supported for schema "${component.slug}" on ${database}`
        );
        process.exit(1);
      }

      const variant = options.variant || "advanced";
      selectedTemplate =
        typeof archConfig === "string" ? archConfig : archConfig[variant];

      if (!selectedTemplate) {
        logger.error(
          `Variant "${variant}" is not supported for schema "${component.slug}"`
        );
        process.exit(1);
      }
    } else {
      selectedTemplate =
        typeof templateConfig === "string"
          ? templateConfig
          : templateConfig[arch];
    }

    if (!selectedTemplate) {
      logger.error(
        `Architecture "${arch}" is not supported by "${component.slug}"`
      );
      process.exit(1);
    }

    templateDir = path.resolve(getTemplatesPath(), selectedTemplate);
    runtimeDeps = component.dependencies?.runtime;
  }

  await copyTemplate({
    templateDir,
    targetDir,
    componentName,
    conflict: options.force ? "overwrite" : "skip",
    dryRun: options.dryRun
  });

  ensurePackageJson(process.cwd());
  ensureTsConfig(process.cwd());

  await installDependencies({
    runtime: runtimeDeps,
    dev: devDeps,
    cwd: process.cwd()
  });

  if (component.env?.length) {
    updateEnvExample(component.env, process.cwd());
  }

  logger.success(
    `\nSuccess! ${capitalize(component.type)} ${component.title} added successfully\n`
  );
}
