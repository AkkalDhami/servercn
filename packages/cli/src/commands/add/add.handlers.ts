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
  selectedProvider?: string;
}> {
  const type: RegistryType = options.type || "component";
  const framework = config.stack.framework;
  const architecture = config.stack.architecture;
  const runtime = config.stack.runtime;
  let selectedPath: string | undefined;
  if (type === "tooling") {
    selectedPath = `${registryItemName}`
  } else {
    // console.log({ type })
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
      case "component":
        selectedPath =
          typeof templateConfig === "string"
            ? templateConfig
            : haveTemplates && templateConfig.templates[architecture];
        break;

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
            {
              component,
              framework,
              db: config.database?.type as DatabaseType,
              orm: config.database?.orm as OrmType,
              runtime,
            }
          );
          return {
            templatePath: selectedPath,
            additionalRuntimeDeps: schemaDeps.runtime || [],
            additionalDevDeps: schemaDeps.dev || [],
          };
        }
        break;

      case "blueprint":
        const bpPath = resolveDatabaseTemplate({
          templateConfig,
          config,
          architecture,
          options,
          registryItemName: component.slug
        });

        selectedPath = `${config.stack.runtime}/${config.stack.framework}/${type}/${bpPath}`;

        if (selectedPath) {
          const bpDeps = resolveDependencies(
            {
              component,
              framework,
              db: config.database?.type as DatabaseType,
              orm: config.database?.orm as OrmType,
              runtime,
            }
          );
          return {
            templatePath: selectedPath,
            additionalRuntimeDeps: bpDeps.runtime || [],
            additionalDevDeps: bpDeps.dev || [],
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
    additionalDevDeps: [],
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

  // console.log({
  //   templateConfig,
  //   registryItemName,
  //   formattedRegistryItemName
  // });
  const dbType = config?.database?.type;
  const orm = config?.database?.orm;

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
  if (options.type === 'blueprint') {
    const selectedConfig = archOptions[architecture] as string;
    return selectedConfig;
  }

  if (options.type == 'schema') {
    return archOptions[formattedRegistryItemName][architecture] as string;
  }
}

async function resolvePromptVariants({
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
      variantConfig?.variants?.[variant]?.dependencies?.dev ?? [],
    selectedProvider: variant
  };
}

export async function runPostInstallHooks({ component, registryItemName, type, runtime, framework, selectedProvider }: {
  registryItemName: string,
  selectedProvider: string,
  type: RegistryType,
  component: any,
  runtime: RuntimeType,
  framework: FrameworkType
}
) {
  if (type === "tooling" && registryItemName === "husky") {
    try {
      await execa("npx", ["husky", "init"], { stdio: "inherit" });
    } catch {
      logger.warn(
        "Could not initialize husky automatically. Please run 'npx husky init' manually."
      );
    }
  } else {

    let filterEnvs: Array<string> = []
    switch (type) {
      case 'component':
        const registry = component?.runtimes[runtime]?.frameworks[framework];

        if (registry?.prompt) {
          filterEnvs = registry?.variants[selectedProvider]?.env?.filter((env: string) => env !== "");
        } else {
          filterEnvs = registry?.env?.filter((env: string) => env !== "");
        }

        break;

      default:
        break;
    }


    if (filterEnvs?.length > 0) {
      updateEnvKeys({
        envFile: ".env.example",
        envKeys: filterEnvs,
        label: registryItemName
      });
      updateEnvKeys({
        envFile: ".env",
        envKeys: filterEnvs,
        label: registryItemName
      });
    }
  }
}

function resolveDependencies(
  { component, framework, db, orm, runtime }: {
    component: RegistrySchema,
    framework: FrameworkType,
    db: DatabaseType,
    orm: OrmType,
    runtime: RuntimeType,
  }
): DependencySet {
  const sets = component.runtimes[runtime].frameworks[framework].databases[db].orms[orm].dependencies;
  return sets;
}
