/* eslint-disable @typescript-eslint/no-explicit-any */
import prompts from "prompts";
import { execa } from "execa";
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
import { spinner } from "@/utils/spinner";
import { updateEnvKeys } from "@/utils/update-env";

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
}> {
  const type: RegistryType = options.type || "component";
  const framework = config.stack.framework;
  const architecture = config.stack.architecture;
  const runtime = config.stack.runtime;
  let selectedPath: string | undefined;
  if (type === "tooling") {
    console.log({ type, registryItemName });
    selectedPath = `${registryItemName}`
  } else {

    if (component?.runtimes[runtime].frameworks[framework]?.variants) {
      return resolvePromptVariants({
        component,
        runtime: runtime,
        architecture,
        framework,
        type
      });
    }
    const templateConfig = component.runtimes[runtime].frameworks[framework];
    const haveTemplates = templateConfig?.templates;
    if (!templateConfig) {
      logger.break();
      logger.error(
        `Unsupported framework '${framework}' for component '${component.slug}'.`
      );
      logger.error(
        `This ${type}: '${component.slug}' does not provide templates for the selected framework.`
      );
      logger.error(
        `Please choose one of the supported frameworks and try again.`
      );
      logger.break();
      process.exit(1);
    }

    switch (type) {
      case "schema":
        const schemaPath = resolveDatabaseTemplate({
          templateConfig,
          config,
          architecture,
          options,
          registryItemName
        });

        selectedPath = `${config.stack.runtime}/${config.stack.framework}/${type}/${schemaPath}`;

        if (selectedPath) {
          const schemaDeps = resolveDependencies(
            component,
            framework,
            config.database?.type as DatabaseType,
            config.database?.orm as OrmType
          );
          return {
            templatePath: selectedPath,
            additionalRuntimeDeps: schemaDeps.runtime || [],
            additionalDevDeps: schemaDeps.dev || []
          };
        }
        break;
      case "blueprint":
        selectedPath = resolveDatabaseTemplate({
          templateConfig,
          config,
          architecture,
          options,
          registryItemName: component.slug
        });

        if (type === "blueprint" && selectedPath) {
          const result = spinner("Installing Dependencies").start();
          const blueprintDeps = resolveDependencies(
            component,
            framework,
            config.database?.type as DatabaseType,
            config.database?.orm as OrmType
          );
          result.succeed();
          return {
            templatePath: selectedPath,
            additionalRuntimeDeps: blueprintDeps.runtime || [],
            additionalDevDeps: blueprintDeps.dev || []
          };
        }
        break;

      default:
        selectedPath =
          typeof templateConfig === "string"
            ? templateConfig
            : haveTemplates && templateConfig.templates[architecture];
        break;
    }

    console.log({ selectedPath });

    if (!selectedPath) {
      logger.break();
      logger.error(
        `Architecture '${architecture}' is not supported for ${type}'${component.slug}'.`
      );
      logger.break();
      process.exit(1);
    }
  }

  return {
    templatePath: type === "tooling" ? `${options.type}/${selectedPath}/base` : `${config.stack.runtime}/${config.stack.framework}/${options.type}/${selectedPath}`,
    additionalRuntimeDeps: [],
    additionalDevDeps: []
  };
}

export function resolveDatabaseTemplate({
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

  // console.log({
  //   templateConfig,
  //   registryItemName,
  //   formattedRegistryItemName
  // });
  const dbType = config.database?.type;
  const orm = config.database?.orm;

  if (!dbType || !orm) {
    logger.break();
    logger.error(
      "Database or ORM not configured.\nPlease add database:type or database:orm in `servercn.config.json` file"
    );
    logger.break();
    process.exit(1);
  }

  const dbConfig = templateConfig.databases[dbType];
  if (!dbConfig || !dbConfig.orms[orm]) {
    logger.break();
    logger.error(
      `Database stack '${dbType}-${orm}' is not supported by "${formattedRegistryItemName}".`
    );
    logger.break();
    process.exit(1);
  }

  const archOptions = dbConfig.orms[orm].templates;

  const selectedConfig = archOptions[formattedRegistryItemName][architecture];
  console.log({ selectedConfig });
  if (!selectedConfig) return undefined;

  // Handle variants (e.g., minimal vs advanced) if they exist
  const variant = options.variant || "advanced";
  return typeof selectedConfig === "string"
    ? selectedConfig
    : selectedConfig[variant];
}

export async function resolvePromptVariants({
  component,
  runtime,
  architecture,
  framework,
  type
}: {
  component: RegistryComponent;
  runtime: RuntimeType;
  architecture: Architecture;
  framework: FrameworkType;
  type: RegistryType;
}): Promise<{
  templatePath: string;
  additionalRuntimeDeps: string[];
  additionalDevDeps: string[];
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

  // console.log({ variantConfig })

  const { variant } = await prompts({
    type: "select",
    name: "variant",
    message: variantConfig?.prompt || "Select",
    choices
  });

  // console.log({ variant })

  if (!variant) {
    logger.break();
    logger.warn("Operation cancelled.");
    logger.break();
    process.exit(0);
  }

  const selectedTemplate =
    variantConfig?.variants?.[variant]?.templates[architecture] || "";

  if (!selectedTemplate) {
    logger.break();
    logger.error(
      `Architecture '${architecture}' is not supported for variant "${variant}".`
    );
    logger.break();
    process.exit(1);
  }

  return {
    templatePath: `${runtime}/${framework}/${type}/${selectedTemplate}`,
    additionalRuntimeDeps:
      variantConfig?.variants?.[variant]?.dependencies?.runtime ?? [],
    additionalDevDeps:
      variantConfig?.variants?.[variant]?.dependencies?.dev ?? []
  };
}

export async function runPostInstallHooks(
  componentName: string,
  type: RegistryType,
  component: any
) {
  if (type === "tooling" && componentName === "husky") {
    try {
      await execa("npx", ["husky", "init"], { stdio: "inherit" });
    } catch {
      logger.warn(
        "Could not initialize husky automatically. Please run 'npx husky init' manually."
      );
    }
  }

  const filterEnvs = component.env?.filter((env: string) => env !== "");

  if (filterEnvs?.length > 0) {
    updateEnvKeys({
      envFile: ".env.example",
      envKeys: filterEnvs,
      label: componentName
    });
    updateEnvKeys({
      envFile: ".env",
      envKeys: filterEnvs,
      label: componentName
    });
  }
}

function resolveDependencies(
  component: RegistrySchema,
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
        acc?.runtime?.push(...(set.runtime || []));
        acc?.dev?.push(...(set.dev || []));
      }
      return acc;
    },
    { runtime: [], dev: [] }
  );
}
