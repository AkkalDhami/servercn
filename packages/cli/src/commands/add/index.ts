import fs from "fs-extra";
import path from "node:path";
import { copyTemplate } from "@/lib/copy";
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
  RegistryType
} from "@/types";
import { capitalize } from "@/utils/capitalize";
import { resolveTemplateResolution, runPostInstallHooks } from "./add.handlers";
import { spinner } from "@/utils/spinner";

export async function add(registryItemName: string, options: AddOptions = {}) {
  validateInput(registryItemName);

  const config = await getServerCNConfig();
  validateStack(config);

  const type: RegistryType = options.type ?? "component";
  const component = await getRegistry(registryItemName, type, options.local);

  await assertInitialized();

  validateCompatibility(component, config);

  const resolution = await resolveTemplateResolution({
    component,
    config,
    options,
    registryItemName
  });

  await scaffoldFiles(
    registryItemName,
    resolution.templatePath,
    options,
    component
  );

  ensureProjectFiles();

  const { runtimeDeps, devDeps } = resolveDependencies({
    component,
    config,
    additionalRuntimeDeps: resolution.additionalRuntimeDeps,
    additionalDevDeps: resolution.additionalDevDeps
  });

  await installDependencies({
    runtime: runtimeDeps,
    dev: devDeps,
    cwd: process.cwd(),
    packageManager: config.project.packageManager
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
    logger.error(
      "Stack configuration is missing. Run `npx servercn-cli init` first."
    );
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
      logger.error(
        `Please choose one of the supported frameworks and try again.`
      );
      logger.break();
      process.exit(1);
    }
  }
}

//? Scaffolding Layer
export async function scaffoldFiles(
  registryItemName: string,
  templatePath: string,
  options: AddOptions,
  component: RegistryItem
) {
  const IS_LOCAL = options.local ?? false;
  const targetDir = paths.targets(".");

  const spin = spinner("Scaffolding files...")?.start();

  if (IS_LOCAL) {
    const templateDir = path.resolve(paths.templates(), templatePath);
    if (!(await fs.pathExists(templateDir))) {
      logger.error(
        `\nTemplate not found: ${templateDir}\nCheck your servercn configuration.\n`
      );
      process.exit(1);
    }
    logger.break();

    await copyTemplate({
      templateDir,
      targetDir,
      registryItemName,
      conflict: options.force ? "overwrite" : "skip"
    });
  } else {
    // Production: extract files from built registry component
    try {
      const files = findFilesByPath(component, templatePath);
      if (!files || files.length === 0) {
        logger.error(`\nNo files found in registry for: ${templatePath}\n`);
        process.exit(1);
      }

      for (const file of files) {
        const destPath = path.join(targetDir, file.path);
        const exists = await fs.pathExists(destPath);

        if (exists && !options.force) {
          logger.skip(file.path);
          continue;
        }

        await fs.ensureDir(path.dirname(destPath));
        await fs.writeFile(destPath, file.content);

        if (exists) {
          logger.overwrite(file.path);
        } else {
          logger.create(file.path);
        }
      }
    } catch (error) {
      logger.error(`\nFailed to scaffold files from registry: ${error}`);
      process.exit(1);
    }
  }

  logger.break();
  spin?.succeed("Scaffolding files successfully!");
}

/**
 * Extracts files from a built registry item based on the template path.
 * The templatePath used in the handlers is runtime/framework/type/subpath.
 */
function findFilesByPath(
  component: RegistryItem,
  templatePath: string
): { type: string; path: string; content: string }[] | null {
  const parts = templatePath.split("/");
  const [runtime, framework, type] = parts;
  const archKey = parts[parts.length - 1]; // e.g. "mvc" or "feature"

  // Handle Tooling
  if (type === "tooling" && "templates" in component) {
    // For tooling, built JSON has templates[key].files
    const templates = component.templates as unknown as Record<
      string,
      { files: { type: string; path: string; content: string }[] }
    >;
    for (const tmpl of Object.values(templates || {})) {
      if (tmpl.files) return tmpl.files;
    }
    return null;
  }

  if (!("runtimes" in component)) return null;

  const runtimes = component.runtimes as unknown as Record<
    string,
    {
      frameworks: Record<
        string,
        {
          architectures?: Record<
            string,
            { files: { type: string; path: string; content: string }[] }
          >;
          variants?: Record<
            string,
            {
              architectures: Record<
                string,
                { files: { type: string; path: string; content: string }[] }
              >;
            }
          >;
          databases?: Record<
            string,
            {
              orms: Record<
                string,
                {
                  templates?: Record<
                    string,
                    {
                      architectures: Record<
                        string,
                        {
                          files: {
                            type: string;
                            path: string;
                            content: string;
                          }[];
                        }
                      >;
                    }
                  >;
                  architectures?: Record<
                    string,
                    {
                      files: { type: string; path: string; content: string }[];
                    }
                  >;
                }
              >;
            }
          >;
        }
      >;
    }
  >;
  const fw = runtimes[runtime]?.frameworks?.[framework];
  if (!fw) return null;

  // 1. Check direct architectures (Foundation/Simple component)
  if (fw.architectures && fw.architectures[archKey]) {
    return fw.architectures[archKey].files;
  }

  // 2. Check variants (Variant component)
  if (fw.variants) {
    for (const v of Object.values(fw.variants)) {
      if (v.architectures && v.architectures[archKey]) {
        return v.architectures[archKey].files;
      }
    }
  }

  // 3. Check databases/ORMs (Blueprint/Schema)
  if (fw.databases) {
    const dbKey = parts[parts.length - 3];
    const ormKey = parts[parts.length - 2];

    const db = fw.databases[dbKey];
    const orm = db?.orms?.[ormKey];

    if (orm) {
      if (type === "blueprint") {
        if (orm.architectures && orm.architectures[archKey]) {
          return orm.architectures[archKey].files;
        }
      } else if (type === "schema") {
        // schema: [..., item, db, orm, arch]
        const itemKey = parts[parts.length - 4];
        const tmpl = orm.templates?.[itemKey];
        if (tmpl?.architectures && tmpl.architectures[archKey]) {
          return tmpl.architectures[archKey].files;
        }
      }
    }
  }

  return null;
}

//? Project File Guards
function ensureProjectFiles() {
  ensurePackageJson(process.cwd());
  ensureTsConfig(process.cwd());
}

//? Dependency Resolution
function resolveDependencies({
  component,
  config,
  additionalDevDeps,
  additionalRuntimeDeps
}: {
  component: RegistryItem;
  config: IServerCNConfig;
  additionalRuntimeDeps: string[];
  additionalDevDeps: string[];
}) {
  // TOOLING (no runtimes)
  if (!("runtimes" in component)) {
    return {
      runtimeDeps: [
        ...(component.dependencies?.runtime ?? []),
        ...additionalRuntimeDeps
      ],
      devDeps: [...(component.dependencies?.dev ?? []), ...additionalDevDeps]
    };
  }

  // RUNTIME-BASED ITEMS
  const framework =
    component.runtimes[config.stack.runtime].frameworks[config.stack.framework];

  return {
    runtimeDeps: [
      ...(framework && "dependencies" in framework
        ? (framework.dependencies?.runtime ?? [])
        : []),
      ...additionalRuntimeDeps
    ],
    devDeps: [
      ...(framework && "dependencies" in framework
        ? (framework?.dependencies?.dev ?? [])
        : []),
      ...additionalDevDeps
    ]
  };
}
