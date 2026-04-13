import { assertInitialized } from "@/lib/assert-initialized";
import { getServerCNConfig } from "@/lib/config";
import { paths } from "@/lib/paths";
import { resolvePath, writeFileSafe } from "@/utils/file";
import { toKebabCase, toPascalCase } from "@/utils/naming";
import { compileTemplate } from "@/utils/template";

import { resolve } from "path";

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
  await generateDTO({
    name,
    fields: [],
    options: {
      ...options,
      flat: true
    },
    type: "dto"
  });
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

export async function generateDTO({
  name,
  fields,
  options,
  type
}: {
  name: string;
  fields: string[];
  options: GeneratorOptions;
  type: "dto" | "validator";
}) {
  await assertInitialized();

  const config = await getServerCNConfig();
  validateStack(config);

  const { architecture } = config;

  const fileName = `${toKebabCase(name)}.${type}.ts`;

  const outputPath = resolveDTOPath({
    name,
    fileName,
    architecture,
    flat: options.flat,
    type
  });

  const className = toPascalCase(name);

  const parsedFields = parseFields(fields || []);

  const content = buildDTOContent({
    name,
    className,
    fields: parsedFields,
    crud: true,
    type
  });

  await writeFileSafe({
    filePath: outputPath,
    content,
    force: options.force
  });
}

function resolveDTOPath({
  name,
  fileName,
  architecture,
  flat,
  type
}: {
  name: string;
  fileName: string;
  architecture: string;
  flat?: boolean;
  type: "dto" | "validator";
}) {
  if (architecture === "feature") {
    return flat
      ? resolve(`src/modules/${toKebabCase(name)}`, fileName)
      : resolve(`src/modules/${toKebabCase(name)}/${type}s`, fileName);
  }

  return resolve(`src/${type}s`, fileName);
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
    } else if (type === "dto") {
      return resolvePath("src/dtos", fileName);
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
    re: "resource",
    dt: "dto",
    va: "validator"
  };

  const resolved = typeAliases[type] || type;

  if (!GENERATOR_TYPES.includes(resolved)) {
    logger.error(`Invalid type: ${type}`);
    logger.info("Available:");
    logger.info(" → controller (co)");
    logger.info(" → service (se)");
    logger.info(" → model (mo)");
    logger.info(" → route (ro)");
    logger.info(" → dt (dto)");
    logger.info(" → va (validator)");
    logger.info(
      " → re (re → controller, service, route, model, dto, validator)"
    );
    process.exit(1);
  }

  return resolved;
}

function parseFields(fields: string[]) {
  return fields.map(field => {
    const [key, type] = field.split(":");

    return {
      key,
      type: type || "string"
    };
  });
}

function mapToZod(type: string) {
  switch (type) {
    case "string":
      return "z.string()";
    case "number":
      return "z.number()";
    case "url":
      return "z.url()";
    case "boolean":
      return "z.boolean()";
    case "email":
      return "z.email()";
    case "date":
      return "z.coerce.date()";
    default:
      return "z.string()";
  }
}

function buildDTOContent({
  name,
  className,
  fields,
  crud,
  type
}: {
  name: string;
  className: string;
  fields: {
    key: string;
    type: string;
  }[];
  crud: boolean;
  type: "dto" | "validator";
}) {
  const baseFields =
    fields.length > 0
      ? fields.map(f => `  ${f.key}: ${mapToZod(f.type)},`).join("\n")
      : `  // TODO: define fields
  name: z.string().min(2),`;

  return `import { z } from "zod";

//* Base schema for ${className}
export const ${name}BaseSchema = z.object({
${baseFields}
});

${
  crud
    ? `
//* Create ${className} ${type}
export const Create${className}${capitalize(type)} = ${name}BaseSchema;

export type Create${className}${capitalize(type)}Type = z.infer<typeof Create${className}${capitalize(type)}>;

//* Update ${className} ${type}
export const Update${className}${capitalize(type)} = ${name}BaseSchema.partial();

export type Update${className}${capitalize(type)}Type = z.infer<typeof Update${className}${capitalize(type)}>;
`
    : ""
}
`;
}
