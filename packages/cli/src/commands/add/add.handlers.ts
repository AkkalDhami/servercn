/* eslint-disable @typescript-eslint/no-explicit-any */
import prompts from "prompts";
import { logger } from "@/utils/logger";
import type {
  AddOptions,
  Architecture,
  DatabaseType,
  DependencySet,
  FrameworkType,
  IServerCNConfig,
  OrmType,
  RegistryComponent,
  RegistrySchema,
  RegistryType,
  RuntimeType,
  SchemaFramework
} from "@/types";

export async function resolveTemplateResolution({
  registryItemName,
  component,
  config,
  options
}: {
  registryItemName: string;
  component: any;
  config: IServerCNConfig;
  options: AddOptions;
}): Promise<{
  templatePath: string;
  additionalRuntimeDeps: string[];
  additionalDevDeps: string[];
  selectedProvider?: string;
}> {
  const type: RegistryType = options.type || "component";
  const framework = config.framework;
  const architecture = config.architecture;
  const runtime = config.runtime;

  const isBuilt = !options.local;

  if (type === "tooling") {
    const selectedPath = registryItemName;
    return {
      templatePath: `tooling/${selectedPath}/base`,
      additionalRuntimeDeps: [],
      additionalDevDeps: []
    };
  }

  const templateConfig = component.runtimes?.[runtime]?.frameworks?.[framework];

  if (!templateConfig) {
    logger.break();
    logger.error(
      `Unsupported framework '${framework}' for ${type}: '${component.slug}'.`
    );
    logger.error(
      `This ${type} does not provide templates for the selected framework.`
    );
    logger.break();
    process.exit(1);
  }

  // Handle variants
  if (templateConfig.variants) {
    return resolvePromptVariants({
      component,
      runtime,
      architecture,
      framework,
      type,
      isBuilt
    });
  }

  let selectedSubPath: string | undefined;

  switch (type) {
    case "component":
    case "foundation":
      if (isBuilt) {
        if (templateConfig.architectures?.[architecture]) {
          selectedSubPath = architecture;
        }
      } else {
        const haveTemplates = templateConfig.templates;
        selectedSubPath =
          typeof templateConfig === "string"
            ? templateConfig
            : haveTemplates?.[architecture];
      }
      break;

    case "schema":
    case "blueprint":
      selectedSubPath = resolveDatabaseTemplate({
        templateConfig,
        config,
        architecture,
        options,
        registryItemName:
          type === "blueprint" ? component.slug : registryItemName
      });
      break;

    default:
      if (!isBuilt) {
        const haveTemplates = templateConfig.templates;
        selectedSubPath =
          typeof templateConfig === "string"
            ? templateConfig
            : haveTemplates && templateConfig.templates[architecture];
      }
      break;
  }

  if (!selectedSubPath) {
    logger.break();
    logger.error(
      `Architecture '${architecture}' is not supported for '${type}:${component.slug}'.`
    );
    logger.break();
    process.exit(1);
  }

  let runtimeDeps: string[] = [];
  let devDeps: string[] = [];

  if (type === "schema" || type === "blueprint") {
    const db = config.database?.engine as DatabaseType;
    const orm = config.database?.adapter as OrmType;
    const deps = resolveDependencies({
      component,
      framework,
      db,
      orm,
      runtime
    });
    runtimeDeps = deps.runtime || [];
    devDeps = deps.dev || [];
  }

  return {
    templatePath: `${runtime}/${framework}/${type}/${selectedSubPath}`,
    additionalRuntimeDeps: runtimeDeps,
    additionalDevDeps: devDeps
  };
}

function resolveDatabaseTemplate({
  templateConfig,
  config,
  architecture,
  options,
  registryItemName
}: {
  templateConfig: SchemaFramework;
  config: IServerCNConfig;
  architecture: Architecture;
  options: AddOptions;
  registryItemName: string;
}): string | undefined {
  const formattedRegistryItemName = registryItemName.includes("/")
    ? registryItemName.split("/").pop() || "index"
    : options.type == "schema"
      ? "index"
      : registryItemName;

  const dbType = config?.database?.engine;
  const orm = config?.database?.adapter;

  if (!dbType || !orm) {
    logger.break();
    logger.error(
      "Database or ORM not configured.\nPlease add database:type or database:orm in `servercn.config.json` file"
    );
    logger.break();
    process.exit(1);
  }

  const dbConfig = templateConfig?.databases[dbType];
  const dbOrm = dbConfig?.orms[orm];

  if (!dbConfig || !dbOrm) {
    logger.break();
    logger.error(
      `Database stack '${dbType}:${orm}' is not supported by ${options.type}:'${formattedRegistryItemName}'.`
    );
    logger.break();
    process.exit(1);
  }

  const archOptions = dbOrm?.templates;
  if (options.type === "blueprint") {
    const path = options?.local
      ? (archOptions[architecture] as string)
      : `${config.database?.engine}/${config.database?.adapter}/${config.architecture}`;
    return path;
  }

  if (options.type == "schema") {
    const path = options?.local
      ? archOptions[formattedRegistryItemName][architecture]
      : `${config.database?.engine}/${config.database?.adapter}/${formattedRegistryItemName}/${config.architecture}`;
    return path;
  }
}

async function resolvePromptVariants({
  component,
  runtime,
  architecture,
  framework,
  type,
  isBuilt
}: {
  component: RegistryComponent;
  runtime: RuntimeType;
  architecture: Architecture;
  framework: FrameworkType;
  type: RegistryType;
  isBuilt: boolean;
}): Promise<{
  templatePath: string;
  additionalRuntimeDeps: string[];
  additionalDevDeps: string[];
  selectedProvider: string;
}> {
  const variantConfig = component.runtimes[runtime].frameworks[framework];
  const choices = Object.entries(variantConfig?.variants || {}).map(
    ([key, value]: [string, { label: string }]) => {
      return {
        title: value.label,
        value: key
      };
    }
  );

  const { variant } = await prompts({
    type: "select",
    name: "variant",
    message: variantConfig?.prompt || "Select",
    choices
  });
  logger.break();

  if (!variant) {
    logger.warn("No variant selected. Operation canceled.");
    logger.break();
    process.exit(0);
  }

  const selectedTemplate = isBuilt
    ? (variantConfig?.variants?.[variant] as any)?.architectures?.[architecture]
      ? architecture
      : ""
    : variantConfig?.variants?.[variant]?.templates[architecture] || "";

  if (!selectedTemplate) {
    logger.break();
    logger.error(
      `Architecture '${architecture}' is not supported for variant "${variant}".`
    );
    logger.break();
    process.exit(1);
  }

  const subPath = isBuilt ? `${variant}/${selectedTemplate}` : selectedTemplate;

  return {
    templatePath: `${runtime}/${framework}/${type}/${subPath}`,
    additionalRuntimeDeps:
      variantConfig?.variants?.[variant]?.dependencies?.runtime ?? [],
    additionalDevDeps:
      variantConfig?.variants?.[variant]?.dependencies?.dev ?? [],
    selectedProvider: variant
  };
}

function resolveDependencies({
  component,
  framework,
  db,
  orm,
  runtime
}: {
  component: RegistrySchema;
  framework: FrameworkType;
  db: DatabaseType;
  orm: OrmType;
  runtime: RuntimeType;
}): DependencySet {
  const sets =
    component.runtimes[runtime].frameworks[framework].databases[db].orms[orm]
      .dependencies;
  return sets;
}
