import { assertInitialized } from "@/lib/assert-initialized";
import { getServerCNConfig } from "@/lib/config";
import { paths } from "@/lib/paths";
import { resolvePath, writeFileSafe } from "@/utils/file";
import { toKebabCase, toPascalCase } from "@/utils/naming";
import { compileTemplate } from "@/utils/template";

import { validateStack } from "@/commands/add";
import type { Architecture, GeneratorType } from "@/types";
import { logger } from "@/utils/logger";
import type { GeneratorOptions } from ".";
import { capitalize } from "@/utils/capitalize";
import { GENERATOR_TYPES } from "@/constants/app.constants";

async function runGenerator({
  name,
  type,
  options
}: {
  name: string;
  type: GeneratorType;
  options?: GeneratorOptions;
}) {
  await assertInitialized();

  const config = await getServerCNConfig();
  validateStack(config);

  const { runtime, framework, architecture } = config;

  const className = toPascalCase(name);
  const modelName = capitalize(name);
  const modelSchemaName = `${className}Schema`;

  const fileName = `${toKebabCase(name)}.${type}.ts`;

  const outputPath = resolveOutputPath({
    architecture,
    name,
    fileName,
    type
  });

  if (!outputPath) {
    logger.error("Failed to resolve output path");
    logger.break();
    process.exit(1);
  }

  const templatePath = paths.cliTemplates({
    fileName: type,
    runtime,
    framework,
    architecture
  });

  const content = compileTemplate(templatePath, {
    name,
    className,
    modelName,
    modelSchemaName
  });

  await writeFileSafe({
    filePath: outputPath,
    content,
    force: options?.force
  });
}

export async function generateController(
  name: string,
  options?: GeneratorOptions
) {
  return runGenerator({
    name,
    type: "controller",
    options
  });
}

export async function generateService(
  name: string,
  options?: GeneratorOptions
) {
  return runGenerator({
    name,
    type: "service",
    options
  });
}

export async function generateResource(
  name: string,
  options?: GeneratorOptions
) {
  await generateController(name, options);
  await generateService(name, options);
  await generateRoute(name, options);
  await generateModel(name, options);
}

export async function generateModel(name: string, options?: GeneratorOptions) {
  return runGenerator({
    name,
    type: "model",
    options
  });
}

export async function generateRoute(name: string, options?: GeneratorOptions) {
  return runGenerator({
    name,
    type: "route",
    options
  });
}

function resolveOutputPath({
  architecture,
  name,
  fileName,
  type
}: {
  architecture: Architecture;
  name: string;
  fileName: string;
  type: GeneratorType;
}) {
  if (architecture === "feature") {
    return resolvePath("src/modules", name, fileName);
  }

  if (architecture === "mvc") {
    if (type === "model") {
      return resolvePath("src/models", fileName);
    } else if (type === "controller") {
      return resolvePath("src/controllers", fileName);
    } else if (type === "service") {
      return resolvePath("src/services", fileName);
    } else if (type === "route") {
      return resolvePath("src/routes", fileName);
    }
  }

  logger.error(`Unsupported architecture: ${architecture}`);
}

export function resolveGeneratorType(type: GeneratorType) {
  const typeAliases: Record<string, GeneratorType> = {
    co: "controller",
    se: "service",
    mo: "model",
    ro: "route",
    re: "resource"
  };

  const resolved = typeAliases[type] || type;

  if (!GENERATOR_TYPES.includes(resolved)) {
    logger.error(`Invalid type: ${type}`);
    logger.info("Available:");
    logger.info(" → controller (co)");
    logger.info(" → service (se)");
    logger.info(" → model (mo)");
    logger.info(" → route (ro)");
    logger.info(" → resource (re)");
    process.exit(1);
  }

  return resolved;
}
