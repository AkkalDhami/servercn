import path from "node:path";
import fs from "fs-extra";
import { glob } from "glob";
import Table from "cli-table3";
import { getRegistry } from "@/lib/registry";
import { paths } from "@/lib/paths";
import { capitalize } from "@/utils/capitalize";
import { highlighter } from "@/utils/highlighter";
import { logger } from "@/utils/logger";
import { findFilesByPath } from "@/utils/file";
import type {
  Architecture,
  DatabaseType,
  FrameworkType,
  OrmType,
  RegistryBlueprint,
  RegistryComponent,
  RegistryFoundation,
  RegistrySchema,
  RegistryType,
  RuntimeType
} from "@/types";
import { SERVERCN_URL } from "@/constants/app.constants";
import type { ViewRegistryItemOptions } from ".";

export type ViewOptions = ViewRegistryItemOptions & {
  type: string;
  name: string;
};

type FileEntry = { type: string; path: string; content: string };
type t = "blueprint" | "schema" | "foundation" | "component";
const TYPE_ALIASES: Record<string, t> = {
  component: "component",
  cp: "component",
  blueprint: "blueprint",
  bp: "blueprint",
  schema: "schema",
  sc: "schema",
  foundation: "foundation",
  fd: "foundation"
};

function resolveType(type: string): RegistryType | null {
  return TYPE_ALIASES[type] ?? null;
}

function firstKey<T extends Record<string, unknown>>(obj?: T) {
  return obj ? (Object.keys(obj)[0] as keyof T) : undefined;
}

function normalizePath(p: string) {
  return p.split(path.sep).join("/");
}

async function readLocalTemplateFiles(
  templatePath: string
): Promise<FileEntry[]> {
  const templateDir = path.resolve(paths.templates(), templatePath);
  if (!(await fs.pathExists(templateDir))) return [];
  const filePaths = await glob("**/*", {
    cwd: templateDir,
    nodir: true,
    dot: true
  });
  const files: FileEntry[] = [];
  for (const relativePath of filePaths) {
    const absolutePath = path.join(templateDir, relativePath);
    const buffer = await fs.readFile(absolutePath);
    const isBinary = buffer.includes(0);
    files.push({
      type: "file",
      path: normalizePath(relativePath),
      content: isBinary ? "[binary]" : buffer.toString("utf8")
    });
  }
  return files;
}

function installationCommand(type: RegistryType, name: string) {
  if (type === "foundation") return `npx servercn-cli init ${name}`;
  if (type === "tooling") return `npx servercn-cli add tl ${name}`;
  if (type === "schema") return `npx servercn-cli add sc ${name}`;
  if (type === "blueprint") return `npx servercn-cli add bp ${name}`;
  return `npx servercn-cli add ${name}`;
}

function renderOverview(rows: Array<[string, string]>) {
  const table = new Table({
    head: [highlighter.create("key"), highlighter.create("value")],
    colWidths: [18, 60]
  });
  rows.forEach(row => table.push(row));
  logger.log(table.toString());
}

function renderList(title: string, items?: string[]) {
  logger.section(title);
  if (!items || items.length === 0) {
    logger.muted("None");
    return;
  }
  items.forEach(item => logger.info(`- ${item}`));
}

function renderDocs(title: string, docs: string) {
  logger.section(title);
  logger.info(docs);
}

function renderInstallationCmd(command: string) {
  logger.section("Installation");
  logger.info(command);
}

function renderFiles(files: FileEntry[]) {
  logger.section(`Files (${files.length})`);
  if (files.length === 0) {
    logger.muted("No files available");
    return;
  }
  files.forEach(file => {
    logger.log(highlighter.create(file.path));
    logger.log(file.content);
    logger.break();
  });
}

export async function viewRegistryItem(options: ViewOptions) {
  const type = resolveType(options.type);
  if (!type || type === "tooling") {
    logger.error(`Unknown type: ${options.type}`);
    process.exit(1);
  }
  const item = await getRegistry(options.name, type, options.local);
  const baseItem = item.runtimes[(options.runtime as RuntimeType) || "node"];

  const docs =
    `${SERVERCN_URL}/docs/${options.fw || firstKey(baseItem.frameworks)}/${type}s/${item.slug}` ||
    "";
  const schema = `${SERVERCN_URL}/sr/${type}/${item.slug}.json` || "";
  const runtime = (options.runtime || "node") as RuntimeType;
  const install = installationCommand(type, options.name);

  const baseOutput = {
    type,
    slug: item.slug,
    installation: install
  };

  if (type === "foundation" || type === "provider") {
    if (options.variant) {
      logger.warn("Variant option is not applicable for foundations/providers");
      process.exit(1);
    }
    const foundation = item as RegistryFoundation;
    const frameworks = foundation.runtimes?.[runtime]?.frameworks || {};
    const framework = (options.fw || firstKey(frameworks)) as
      | FrameworkType
      | undefined;
    const selectedFramework = framework ? frameworks[framework] : undefined;
    if (!selectedFramework) {
      logger.error(`Framework not available for ${item.slug}`);
      process.exit(1);
    }
    const templates = selectedFramework.templates || {};
    const archs = Object.keys(selectedFramework.architectures) || undefined;
    const inputArch =
      (options.arch as Architecture) ||
      (Object.keys(templates)[0] as Architecture);
    const templatePath = options.local
      ? `node/${framework}/foundation/${templates[(inputArch as Architecture) || ""]}`
      : `node/${framework}/foundation/${inputArch}`;
    const files =
      findFilesByPath(item, templatePath) ||
      (options.local
        ? await readLocalTemplateFiles(templatePath)
        : await readLocalTemplateFiles(templatePath)) ||
      [];

    const output = {
      ...baseOutput,
      runtime,
      framework,
      architecture: inputArch || archs,
      dependencies: selectedFramework.dependencies,
      env: selectedFramework.env,
      templates: selectedFramework.templates,
      docs,
      schema,
      ...(options.files ? { files } : {})
    };

    if (options.json) {
      process.stdout.write(JSON.stringify(output, null, 2));
      logger.break();
      return;
    }

    logger.break();

    renderOverview([
      ["slug", item.slug],
      ["type", type],
      ["installation", install],
      ["runtime", runtime],
      ["framework", framework || "-"],
      ["architecture", inputArch || archs?.join(", ") || "-"]
    ]);
    renderList("Dependencies", selectedFramework.dependencies?.runtime);
    renderList("DevDependencies", selectedFramework.dependencies?.dev);
    renderList("Env Variables", selectedFramework.env);
    renderDocs("Documentation", docs);
    renderInstallationCmd(install);
    renderDocs("JSON Schema", schema);

    if (options.files) {
      renderFiles(files);
    }
    return;
  }

  if (type === "component") {
    if (options.variant && !options.arch) {
      logger.warn(
        "Variant option is only applicable when architecture is specified for components"
      );
      process.exit(1);
    }
    const component = item as RegistryComponent;
    const frameworks = component.runtimes?.[runtime]?.frameworks || {};
    const framework = (options.fw || firstKey(frameworks)) as
      | FrameworkType
      | undefined;
    const fw = framework ? frameworks[framework] : undefined;
    if (!fw) {
      logger.error(`Framework not available for ${item.slug}`);
      process.exit(1);
    }

    let dependencies: { runtime?: string[]; dev?: string[] } | undefined;
    let env: string[] | undefined;
    let templates: Record<string, string> = {};
    let variantKey: string | undefined;

    if ("variants" in fw && fw.variants) {
      variantKey = options.variant || (firstKey(fw.variants) as string);
      const variant = variantKey ? fw?.variants[variantKey] : undefined;
      if (!variant) {
        logger.error(`Variant not found: ${variantKey}`);
        process.exit(1);
      }
      dependencies = variant.dependencies;
      env = variant.env;
      templates = variant.templates || {};
    } else {
      dependencies = fw.dependencies;
      env = fw.env;
      templates = fw.templates || {};
    }
    const archs = Object.keys(fw.architectures || {}) || undefined;
    const inputArch =
      (options.arch as Architecture) ||
      (Object.keys(templates)[0] as Architecture);
    const templatePath = options.local
      ? `node/${framework}/component/${templates[inputArch]}`
      : `node/${framework}/component/${templates}/${inputArch}`;
    const files =
      findFilesByPath(item, templatePath, variantKey) ||
      (options.local ? await readLocalTemplateFiles(templatePath) : []) ||
      [];

    const docs =
      `${SERVERCN_URL}/docs/${framework}/${type}s/${item.slug}` || "";
    const schema = `${SERVERCN_URL}/sr/${type}/${item.slug}.json` || "";
    const output = {
      ...baseOutput,
      runtime,
      framework,
      architecture: inputArch || archs || "-",
      variant: variantKey,
      dependencies,
      env,
      docs,
      schema,
      ...(options.files ? { files } : {})
    };

    if (options.json) {
      process.stdout.write(JSON.stringify(output, null, 2));
      logger.break();
      return;
    }

    logger.break();
    logger.log(highlighter.create(`${capitalize(type)}: ${item.slug}`));
    renderOverview([
      ["slug", item.slug],
      ["type", type],
      ["installation", install],
      ["runtime", runtime],
      ["framework", framework || "-"],
      ["variant", variantKey || "-"],
      ["architecture", inputArch || archs?.join(", ") || "-"]
    ]);
    renderList("Dependencies", dependencies?.runtime);
    renderList("DevDependencies", dependencies?.dev);
    renderList("Env Variables", env);
    renderDocs("Documentation", docs);
    renderInstallationCmd(install);
    renderDocs("JSON Schema", schema);
    if (options.files) {
      renderFiles(files);
    }
    return;
  }

  if (type === "blueprint") {
    if (options.variant) {
      logger.warn("Variant option is not applicable for blueprints");
      process.exit(1);
    }
    const blueprint = item as RegistryBlueprint;
    const frameworks = blueprint.runtimes?.[runtime]?.frameworks || {};
    const framework = (options.fw || firstKey(frameworks)) as
      | FrameworkType
      | undefined;
    const fw = framework ? frameworks[framework] : undefined;
    if (!fw) {
      logger.error(`Framework not available for ${item.slug}`);
      process.exit(1);
    }
    const db = (options.db || firstKey(fw.databases)) as
      | DatabaseType
      | undefined;
    const database = db ? fw.databases[db] : undefined;
    if (!database) {
      logger.error(`Database not available for ${item.slug}`);
      process.exit(1);
    }
    const orm = (options.orm || firstKey(database.orms)) as OrmType | undefined;
    const ormConfig = orm ? database.orms[orm] : undefined;
    if (!ormConfig) {
      logger.error(`ORM not available for ${item.slug}`);
      process.exit(1);
    }
    const archs = Object.keys(ormConfig.templates || {}) as Architecture[];
    const inputArch =
      (options.arch as Architecture) || (archs[0] as Architecture);
    const templatePath = options.local
      ? `node/${framework}/blueprint/${ormConfig.templates[inputArch]}`
      : `node/${framework}/blueprint/${db}/${orm}/${inputArch}`;
    const files =
      findFilesByPath(item, templatePath) ||
      (options.local ? await readLocalTemplateFiles(templatePath) : []) ||
      [];

    const output = {
      ...baseOutput,
      runtime,
      framework,
      database: db,
      orm,
      architecture: inputArch || archs.join(", "),
      dependencies: ormConfig.dependencies,
      files,
      docs,
      schema
    };

    if (options.json) {
      process.stdout.write(JSON.stringify(output, null, 2));
      logger.break();
      return;
    }

    logger.break();
    renderOverview([
      ["slug", item.slug],
      ["type", type],
      ["installation", install],
      ["runtime", runtime],
      ["framework", framework || "-"],
      ["database", db || "-"],
      ["orm", orm || "-"],
      ["architecture", inputArch || archs.join(", ")]
    ]);
    renderList("Dependencies", ormConfig.dependencies?.runtime);
    renderList("DevDependencies", ormConfig.dependencies?.dev);
    renderList("Env Variables", ormConfig.env);
    renderDocs("Documentation", docs);
    renderInstallationCmd(install);
    renderDocs("JSON Schema", schema);
    if (options.files) {
      renderFiles(files);
    }
    return;
  }

  if (type === "schema") {
    if (options.variant) {
      logger.warn("Variant option is not applicable for schemas");
      process.exit(1);
    }
    const schema = item as RegistrySchema;
    const frameworks = schema.runtimes?.[runtime]?.frameworks || {};
    const framework = (options.fw || firstKey(frameworks)) as
      | FrameworkType
      | undefined;
    const fw = framework ? frameworks[framework] : undefined;
    if (!fw) {
      logger.error(`Framework not available for ${item.slug}`);
      process.exit(1);
    }
    const db = (options.db || firstKey(fw.databases)) as
      | DatabaseType
      | undefined;
    const database = db ? fw.databases[db] : undefined;
    if (!database) {
      logger.error(`Database not available for ${item.slug}`);
      process.exit(1);
    }
    const orm = (options.orm || firstKey(database.orms)) as OrmType | undefined;
    const ormConfig = orm ? database.orms[orm] : undefined;
    if (!ormConfig) {
      logger.error(`ORM not available for ${item.slug}`);
      process.exit(1);
    }
    const templateKey =
      (ormConfig.templates && (firstKey(ormConfig.templates) as string)) ||
      "index";
    const template = ormConfig.templates?.[templateKey];
    if (!template) {
      logger.error(`Template not available for ${item.slug}`);
      process.exit(1);
    }
    const arch =
      (options.arch as Architecture) ||
      (Object.keys(template)[0] as Architecture);
    const templatePath = options.local
      ? `node/${framework}/schema/${template[arch] as string}`
      : `node/${framework}/schema/${db}/${orm}/${templateKey}/${arch}`;
    const files =
      findFilesByPath(item, templatePath) ||
      (options.local ? await readLocalTemplateFiles(templatePath) : []) ||
      [];

    const output = {
      ...baseOutput,
      runtime,
      framework,
      database: db,
      orm,
      template: templateKey,
      architecture: arch,
      dependencies: ormConfig.dependencies,
      files
    };

    if (options.json) {
      process.stdout.write(JSON.stringify(output, null, 2));
      logger.break();
      return;
    }

    logger.break();
    logger.log(highlighter.create(`${capitalize(type)}: ${item.slug}`));
    renderOverview([
      ["slug", item.slug],
      ["type", type],
      ["installation", install],
      ["runtime", runtime],
      ["framework", framework || "-"],
      ["database", db || "-"],
      ["orm", orm || "-"],
      ["architecture", arch || "-"]
    ]);
    renderList("Dependencies", ormConfig.dependencies?.runtime);
    renderList("DevDependencies", ormConfig.dependencies?.dev);
    renderDocs("Documentation", docs);
    renderInstallationCmd(install);
    const jsonSchema = `${SERVERCN_URL}/sr/${type}/${item.slug}.json` || "";
    renderDocs("JSON Schema", jsonSchema);
    if (options.files) {
      renderFiles(files);
    }
    return;
  }
}
