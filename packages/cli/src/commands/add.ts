import path from "path";
import prompts from "prompts";

import { getTemplatesPath } from "../lib/paths";
import { copyTemplate } from "../lib/copy";
import { getRegistryComponent } from "../lib/registry";
import { resolveTargetDir } from "../lib/architecture";
import { installDependencies } from "../lib/install-deps";
import { updateEnvExample } from "../lib/env";
import { ensurePackageJson, ensureTsConfig } from "../lib/package";
import { askFolderName, getDefaultFolderName } from "../lib/prompts";
import { logger } from "../utils/cli-logger";
import { assertInitialized } from "../lib/assert-initialized";
import { getServerCNConfig } from "../lib/config";
import type { AddOptions } from "../types";

export async function add(componentName: string, options: AddOptions = {}) {
  await assertInitialized();
  
  const config = await getServerCNConfig();

  const component = await getRegistryComponent(componentName, "component");

  if (!component.stacks.includes(config.stack.framework)) {
    logger.error(
      `Component "${componentName}" does not support "${config.stack.framework}"`
    );
    process.exit(1);
  }

  const stack = config.stack.framework;
  const arch = config.stack.architecture;

  const defaultFolder = getDefaultFolderName(component);
  const folderName = await askFolderName(defaultFolder);
  const targetDir = resolveTargetDir(folderName, arch);

  let templateDir: string;
  let runtimeDeps: string[] | undefined;
  const devDeps = component.dependencies?.dev;

  if (component.algorithms) {
    const choices = Object.entries(component.algorithms).map(
      ([key, value]: any) => ({
        title: value.title,
        value: key,
      })
    );

    const { algorithm } = await prompts({
      type: "select",
      name: "algorithm",
      message: "Select implementation",
      choices,
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
        `Architecture "${arch}" is not supported for "${component.name}"`
      );
      process.exit(1);
    }

    templateDir = path.resolve(getTemplatesPath(), selectedTemplate);
    runtimeDeps = algoConfig.dependencies?.runtime;

    logger.info(`Using algorithm: ${algoConfig.title}`);
  } else {
    const templateConfig = component.templates?.[stack];

    if (!templateConfig) {
      logger.error(`Stack "${stack}" is not supported by "${component.name}"`);
      process.exit(1);
    }

    const selectedTemplate =
      typeof templateConfig === "string"
        ? templateConfig
        : (templateConfig[arch] ?? templateConfig.base);

    if (!selectedTemplate) {
      logger.error(
        `Architecture "${arch}" is not supported by "${component.name}"`
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
    dryRun: options.dryRun,
  });

  ensurePackageJson(process.cwd());
  ensureTsConfig(process.cwd());

  await installDependencies({
    runtime: runtimeDeps,
    dev: devDeps,
    cwd: process.cwd(),
  });

  if (component.env?.length) {
    updateEnvExample(component.env, process.cwd());
  }

  logger.success(`\n${component.title} added successfully\n`);
  process.exit(0);
}
