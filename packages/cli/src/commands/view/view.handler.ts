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
  RegistryTooling,
  RegistryType,
  RuntimeType
} from "@/types";

export type ViewOptions = {
  type: string;
  name: string;
  json?: boolean;
  local?: boolean;
  fw?: string;
  arch?: string;
  db?: string;
  orm?: string;
  variant?: string;
  template?: string;
  runtime?: string;
};

type FileEntry = { type: string; path: string; content: string };

const TYPE_ALIASES: Record<string, RegistryType> = {
  component: "component",
  cp: "component",
  blueprint: "blueprint",
  bp: "blueprint",
  schema: "schema",
  sc: "schema",
  tooling: "tooling",
  tl: "tooling",
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
    head: [highlighter.error("key"), highlighter.error("value")],
    colWidths: [18, 20]
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

function renderKeyValue(title: string, value?: string) {
  logger.section(highlighter.create(title));
  logger.info(value || "-");
}

function renderTemplates(title: string, templates?: Record<string, string>) {
  logger.section(highlighter.create(title));
  if (!templates || Object.keys(templates).length === 0) {
    logger.muted("None");
    return;
  }
  const table = new Table({
    head: [highlighter.error("arch"), highlighter.error("path")],
    colWidths: [16, 40]
  });
  Object.entries(templates).forEach(([arch, value]) => {
    table.push([arch, value]);
  });
  logger.log(table.toString());
}

function renderFiles(files: FileEntry[]) {
  logger.section(highlighter.create(`Files (${files.length})`));
  if (files.length === 0) {
    logger.muted("No files available");
    return;
  }
  files.forEach(file => {
    logger.log(highlighter.warn(file.path));
    logger.log(file.content);
    logger.break();
  });
}

export async function viewRegistryItem(options: ViewOptions) {
  const type = resolveType(options.type);
  if (!type) {
    logger.error(`Unknown type: ${options.type}`);
    process.exit(1);
  }

  const item = await getRegistry(options.name, type, options.local);
  console.log({
    item
  });
  const runtime = (options.runtime || "node") as RuntimeType;
  const install = installationCommand(type, options.name);

  const baseOutput = {
    type,
    slug: item.slug,
    installation: install
  };

  if (type === "tooling") {
    const tooling = item as RegistryTooling;
    const templateKey =
      (options.template || firstKey(tooling.templates))?.toString() || "";
    const deps = tooling.dependencies;
    const templateValue = templateKey ? tooling.templates[templateKey] : "";
    const templatePath = templateValue ? `tooling/${templateValue}` : "";
    const files =
      (templatePath && findFilesByPath(item, templatePath)) ||
      (templatePath && options.local
        ? await readLocalTemplateFiles(`tooling/${templateValue}`)
        : []) ||
      [];

    const output = {
      ...baseOutput,
      template: templateKey,
      dependencies: deps,
      templates: tooling.templates,
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
      ["template", templateKey || "-"]
    ]);
    renderList("Dependencies", deps?.runtime);
    renderList("DevDependencies", deps?.dev);
    renderKeyValue("Templates", "");
    renderTemplates("Templates", tooling.templates);
    renderFiles(files);
    return;
  }

  if (type === "foundation") {
    const foundation = item as RegistryFoundation;
    const frameworks = foundation.runtimes?.[runtime]?.frameworks || {};
    const framework = (options.fw || firstKey(frameworks)) as
      | FrameworkType
      | undefined;
    const fw = framework ? frameworks[framework] : undefined;
    if (!fw) {
      logger.error(`Framework not available for ${item.slug}`);
      process.exit(1);
    }
    const templates = fw.templates || {};
    const arch =
      (options.arch as Architecture) ||
      (Object.keys(templates)[0] as Architecture);
    const templatePath = options.local
      ? `node/${framework}/foundation/${templates[arch]}`
      : `node/${framework}/foundation/${arch}`;
    const files =
      findFilesByPath(item, templatePath) ||
      (options.local ? await readLocalTemplateFiles(templatePath) : []) ||
      [];

    const output = {
      ...baseOutput,
      runtime,
      framework,
      architecture: arch,
      dependencies: fw.dependencies,
      env: fw.env,
      templates: fw.templates,
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
      ["architecture", arch || "-"]
    ]);
    renderList("Dependencies", fw.dependencies?.runtime);
    renderList("DevDependencies", fw.dependencies?.dev);
    renderList("Env Variables", fw.env);
    renderTemplates("Templates", fw.templates);
    renderFiles(files);
    return;
  }

  if (type === "component") {
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
      const variant = variantKey ? fw.variants[variantKey] : undefined;
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

    const arch =
      (options.arch as Architecture) ||
      (Object.keys(templates)[0] as Architecture);
    const templatePath = options.local
      ? `node/${framework}/component/${templates[arch]}`
      : `node/${framework}/component/${arch}`;
    const files =
      findFilesByPath(item, templatePath, variantKey) ||
      (options.local ? await readLocalTemplateFiles(templatePath) : []) ||
      [];

    const output = {
      ...baseOutput,
      runtime,
      framework,
      architecture: arch,
      variant: variantKey,
      dependencies,
      env,
      templates,
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
      ["variant", variantKey || "-"],
      ["architecture", arch || "-"]
    ]);
    renderList("Dependencies", dependencies?.runtime);
    renderList("DevDependencies", dependencies?.dev);
    renderList("Env Variables", env);
    renderTemplates("Templates", templates);
    renderFiles(files);
    return;
  }

  if (type === "blueprint") {
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
    const arch =
      (options.arch as Architecture) ||
      (Object.keys(ormConfig.templates || {})[0] as Architecture);
    const templatePath = options.local
      ? `node/${framework}/blueprint/${ormConfig.templates[arch]}`
      : `node/${framework}/blueprint/${db}/${orm}/${arch}`;
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
      architecture: arch,
      dependencies: ormConfig.dependencies,
      templates: ormConfig.templates,
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
    renderTemplates("Templates", ormConfig.templates);
    renderFiles(files);
    return;
  }

  if (type === "schema") {
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
      options.template ||
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
      ["template", templateKey || "-"],
      ["architecture", arch || "-"]
    ]);
    renderList("Dependencies", ormConfig.dependencies?.runtime);
    renderList("DevDependencies", ormConfig.dependencies?.dev);
    renderFiles(files);
    return;
  }
}
