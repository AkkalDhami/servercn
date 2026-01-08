#!/usr/bin/env node

// src/cli.ts
import { Command } from "commander";

// src/commands/add.ts
import path10 from "path";
import prompts2 from "prompts";

// src/lib/paths.ts
import path from "path";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
function getServercnRoot() {
  return path.resolve(__dirname, "../../..");
}
function getRegistryPath() {
  return path.join(getServercnRoot(), "packages/registry");
}
function getTemplatesPath() {
  return path.join(getServercnRoot(), "packages/templates");
}

// src/lib/copy.ts
import fs from "fs-extra";
import path2 from "path";

// src/utils/cli-colors.ts
import kleur from "kleur";
var colors = {
  error: kleur.red,
  warn: kleur.yellow,
  info: kleur.cyan,
  success: kleur.green,
  muted: kleur.gray,
  created: kleur.magenta
};

// src/utils/cli-logger.ts
var logger = {
  error(...args) {
    console.log(colors.error(`${args.join(" ")}`));
  },
  warn(...args) {
    console.log(colors.warn(`${args.join(" ")}`));
  },
  info(...args) {
    console.log(colors.info(`${args.join(" ")}`));
  },
  success(...args) {
    console.log(colors.success(`${args.join(" ")}`));
  },
  log(...args) {
    console.log(args.join(" "));
  },
  created(...args) {
    console.log(colors.created(`\u2714 Created ${args.join(" ")}`));
  },
  break() {
    console.log("");
  }
};

// src/lib/copy.ts
function toKebabCase(value) {
  return value.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[\s_]+/g, "-").toLowerCase();
}
function toCamelCase(value) {
  return value.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : "").replace(/^(.)/, (m) => m.toLowerCase());
}
function toPascalCase(value) {
  const camel = toCamelCase(value);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}
function toSnakeCase(value) {
  return value.replace(/([a-z])([A-Z])/g, "$1_$2").replace(/[\s-]+/g, "_").toLowerCase();
}
function applyNaming(value, style) {
  switch (style) {
    case "camel-case":
      return toCamelCase(value);
    case "snake-case":
      return toSnakeCase(value);
    case "kebab-case":
    default:
      return toKebabCase(value);
  }
}
function applyFunctionNaming(value, style) {
  switch (style) {
    case "pascal-case":
      return toPascalCase(value);
    case "snake-case":
      return toSnakeCase(value);
    case "camel-case":
    default:
      return toCamelCase(value);
  }
}
async function copyTemplate({
  templateDir,
  targetDir,
  componentName,
  conventions,
  replacements = {},
  conflict = "skip",
  dryRun = false
}) {
  if (!await fs.pathExists(templateDir)) {
    logger.error(`Template not found: ${templateDir}`);
    return;
  }
  await fs.ensureDir(targetDir);
  const entries = await fs.readdir(templateDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path2.join(templateDir, entry.name);
    let rawName = entry.name === "_gitignore" ? ".gitignore" : entry.name;
    let finalName = rawName;
    if (componentName && rawName.includes("component")) {
      const baseName = applyNaming(componentName, conventions.fileNaming);
      finalName = rawName.replace("component", baseName);
    }
    const destPath = path2.join(targetDir, finalName);
    if (entry.isDirectory()) {
      await copyTemplate({
        templateDir: srcPath,
        targetDir: destPath,
        componentName,
        conventions,
        replacements,
        conflict,
        dryRun
      });
      continue;
    }
    const exists = await fs.pathExists(destPath);
    if (exists) {
      if (conflict === "skip") {
        logger.warn(`Skipped: ${destPath}`);
        continue;
      }
      if (conflict === "error") {
        throw new Error(`File already exists: ${destPath}`);
      }
    }
    if (dryRun) {
      logger.info(`[dry-run] ${exists ? "Overwrite" : "Create"}: ${destPath}`);
      continue;
    }
    const buffer = await fs.readFile(srcPath);
    const isBinary = buffer.includes(0);
    await fs.ensureDir(path2.dirname(destPath));
    if (isBinary) {
      await fs.copyFile(srcPath, destPath);
    } else {
      let content = buffer.toString("utf8");
      if (componentName) {
        const fileName = applyNaming(componentName, conventions.fileNaming);
        const functionName = applyFunctionNaming(
          componentName,
          conventions.functionNaming
        );
        content = content.replaceAll("{{fileName}}", fileName).replaceAll("{{FILE_NAME}}", fileName.toUpperCase()).replaceAll("{{functionName}}", functionName).replaceAll("{{FUNCTION_NAME}}", functionName.toUpperCase());
      }
      for (const [key, value] of Object.entries(replacements)) {
        content = content.replaceAll(`{{${key}}}`, value);
      }
      await fs.writeFile(destPath, content);
    }
    logger.success(
      exists ? `Overwritten: ${destPath}` : `Created: ${destPath}`
    );
  }
}

// src/lib/registry.ts
import fs2 from "fs-extra";
import path3 from "path";
async function getRegistryComponent(name) {
  const registryPath = getRegistryPath();
  const filePath = path3.join(registryPath, `${name}.json`);
  if (!await fs2.pathExists(filePath)) {
    logger.error(`Component "${name}" not found`);
    process.exit(1);
  }
  return fs2.readJSON(filePath);
}

// src/lib/architecture.ts
import path4 from "path";
function resolveTargetDir(folderName, arch) {
  const cwd = process.cwd();
  switch (arch) {
    case "mvc":
      return path4.join(cwd, folderName);
    case "feature":
      return path4.join(cwd, folderName);
    case "clean":
      return path4.join(cwd, folderName);
    default:
      return cwd;
  }
}

// src/lib/install-deps.ts
import { execa } from "execa";

// src/lib/detect.ts
import fs3 from "fs";
import path5 from "path";
function detectPackageManager(cwd = process.cwd()) {
  if (fs3.existsSync(path5.join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (fs3.existsSync(path5.join(cwd, "yarn.lock"))) return "yarn";
  if (fs3.existsSync(path5.join(cwd, "bun.lockb"))) return "bun";
  return "npm";
}

// src/lib/install-deps.ts
async function installDependencies({
  runtime = [],
  dev = [],
  cwd
}) {
  if (!runtime.length && !dev.length) return;
  const pm = detectPackageManager();
  const run = async (args) => {
    logger.info(`Installing dependencies: ${args.join(" ")}`);
    await execa(pm, args, {
      cwd,
      stdio: "inherit"
    });
  };
  if (runtime.length) {
    await run(getInstallArgs(pm, runtime, false));
  }
  if (dev.length) {
    await run(getInstallArgs(pm, dev, true));
  }
}
function getInstallArgs(pm, packages, isDev) {
  switch (pm) {
    case "pnpm":
      return ["add", ...isDev ? ["-D"] : [], ...packages];
    case "yarn":
      return ["add", ...isDev ? ["-D"] : [], ...packages];
    case "bun":
      return ["add", ...isDev ? ["-d"] : [], ...packages];
    case "npm":
    default:
      return ["install", ...isDev ? ["--save-dev"] : [], ...packages];
  }
}

// src/lib/env.ts
import fs4 from "fs";
import path6 from "path";
function updateEnvExample(envKeys = [], cwd = process.cwd()) {
  if (!envKeys.length) return;
  const envExamplePath = path6.join(cwd, ".env.example");
  const existing = fs4.existsSync(envExamplePath) ? fs4.readFileSync(envExamplePath, "utf8") : "";
  const existingKeys = new Set(
    existing.split("\n").map((line) => line.split("=")[0]?.trim()).filter(Boolean)
  );
  const newLines = envKeys.filter((key) => !existingKeys.has(key)).map((key) => `${key}=`);
  if (!newLines.length) return;
  const content = existing.trim().length > 0 ? `${existing.trim()}

${newLines.join("\n")}
` : `${newLines.join("\n")}
`;
  fs4.writeFileSync(envExamplePath, content, "utf8");
  logger.success(`Updated .env.example`);
}

// src/lib/package.ts
import fs5 from "fs";
import path7 from "path";
import { execSync } from "child_process";
function ensurePackageJson(dir) {
  const pkgPath = path7.join(dir, "package.json");
  if (fs5.existsSync(pkgPath)) return;
  logger.info("Initializing package.json");
  execSync("npm init -y", {
    cwd: dir,
    stdio: "ignore"
  });
}
function ensureTsConfig(dir) {
  const tsconfigPath = path7.join(dir, "tsconfig.json");
  if (fs5.existsSync(tsconfigPath)) return;
  const tsconfig = {
    compilerOptions: {
      target: "ES2021",
      module: "NodeNext",
      moduleResolution: "NodeNext",
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      outDir: "dist",
      rootDir: "src"
    },
    include: ["src"]
  };
  fs5.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
}

// src/lib/prompts.ts
import prompts from "prompts";
async function askFolderName(defaultName) {
  const { folder } = await prompts({
    type: "text",
    name: "folder",
    message: "Where should this component be added?",
    initial: defaultName
  });
  return folder || defaultName;
}
function getDefaultFolderName(component) {
  return component.name;
}

// src/lib/assert-initialized.ts
import fs6 from "fs-extra";
import path8 from "path";
var CONFIG_FILE = "servercn.json";
async function assertInitialized() {
  const configPath = path8.resolve(process.cwd(), CONFIG_FILE);
  if (!await fs6.pathExists(configPath)) {
    logger.error("ServerCN is not initialized in this project.");
    logger.info("Run the following command first:");
    logger.info("  npx servercn init");
    process.exit(1);
  }
}

// src/lib/config.ts
import fs7 from "fs-extra";
import path9 from "path";
async function getServerCNConfig() {
  const cwd = process.cwd();
  const configPath = path9.resolve(cwd, "servercn.json");
  if (!await fs7.pathExists(configPath)) {
    logger.warn("ServerCN is not initialized. Run `servercn init` first.");
    process.exit(1);
  }
  return fs7.readJSON(configPath);
}

// src/commands/add.ts
async function add(componentName, options = {}) {
  console.log(componentName);
  await assertInitialized();
  const config = await getServerCNConfig();
  const component = await getRegistryComponent(componentName);
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
  let templateDir;
  let runtimeDeps;
  const devDeps = component.dependencies?.dev;
  if (component.algorithms) {
    const choices = Object.entries(component.algorithms).map(
      ([key, value]) => ({
        title: value.title,
        value: key
      })
    );
    const { algorithm } = await prompts2({
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
    const selectedTemplate = algoConfig.templates?.[arch] ?? algoConfig.templates?.base;
    if (!selectedTemplate) {
      logger.error(
        `Architecture "${arch}" is not supported for "${component.name}"`
      );
      process.exit(1);
    }
    templateDir = path10.resolve(getTemplatesPath(), selectedTemplate);
    runtimeDeps = algoConfig.dependencies?.runtime;
    logger.info(`Using algorithm: ${algoConfig.title}`);
  } else {
    const templateConfig = component.templates?.[stack];
    if (!templateConfig) {
      logger.error(`Stack "${stack}" is not supported by "${component.name}"`);
      process.exit(1);
    }
    const selectedTemplate = typeof templateConfig === "string" ? templateConfig : templateConfig[arch] ?? templateConfig.base;
    if (!selectedTemplate) {
      logger.error(
        `Architecture "${arch}" is not supported by "${component.name}"`
      );
      process.exit(1);
    }
    templateDir = path10.resolve(getTemplatesPath(), selectedTemplate);
    runtimeDeps = component.dependencies?.runtime;
  }
  await copyTemplate({
    templateDir,
    targetDir,
    componentName,
    conventions: config.conventions,
    // <-- fileNaming + functionNaming
    replacements: {
      PROJECT_NAME: config.project.name
    },
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
  logger.success(`
${component.title} added successfully
`);
  process.exit(0);
}

// src/commands/init.ts
import fs8 from "fs-extra";
import path11 from "path";
import prompts3 from "prompts";
var CONFIG_FILE2 = "servercn.json";
async function init() {
  const cwd = process.cwd();
  const configPath = path11.join(cwd, CONFIG_FILE2);
  if (await fs8.pathExists(configPath)) {
    logger.warn("ServerCN is already initialized in this project.");
    logger.info("You can now run: servercn add <component>");
    process.exit(1);
  }
  const response = await prompts3([
    {
      type: "text",
      name: "root",
      message: "Project root directory",
      initial: ".",
      format: (val) => val.trim() || "."
    },
    {
      type: "text",
      name: "srcDir",
      message: "Source directory",
      initial: "src",
      format: (val) => val.trim() || "src"
    },
    {
      type: "select",
      name: "architecture",
      message: "Select architecture",
      choices: [
        { title: "MVC", value: "mvc" },
        { title: "Feature-based", value: "feature" }
      ]
    },
    {
      type: "select",
      name: "language",
      message: "Language",
      choices: [
        { title: "TypeScript", value: "typescript" }
      ]
    },
    {
      type: "select",
      name: "framework",
      message: "Backend framework",
      choices: [{ title: "Express", value: "express" }]
    },
    {
      type: "select",
      name: "databaseType",
      message: "Select database",
      choices: [
        { title: "MongoDB", value: "mongodb" }
      ]
    },
    {
      type: (prev) => prev === "mongodb" ? "select" : null,
      name: "orm",
      message: "MongoDB library",
      choices: [
        { title: "Mongoose", value: "mongoose" }
      ]
    },
    {
      type: (_prev, values) => ["postgresql", "mysql", "sqlite"].includes(values.databaseType) ? "select" : null,
      name: "orm",
      message: "ORM / Query builder",
      choices: [
        { title: "Prisma", value: "prisma" },
        { title: "Drizzle", value: "drizzle" },
        { title: "Sequelize", value: "sequelize" },
        { title: "Knex", value: "knex" }
      ]
    },
    {
      type: "select",
      name: "packageManager",
      message: "Package manager",
      choices: [
        { title: "npm", value: "npm" },
        { title: "pnpm", value: "pnpm" },
        { title: "yarn", value: "yarn" }
      ],
      initial: 0
    },
    {
      type: "select",
      name: "fileNaming",
      message: "File naming convention",
      choices: [
        { title: "camelCase", value: "camel-case" },
        { title: "kebab-case", value: "kebab-case" },
        { title: "snake_case", value: "snake-case" },
        { title: "PascalCase", value: "pascal-case" }
      ]
    },
    {
      type: "select",
      name: "functionNaming",
      message: "Function naming convention",
      choices: [
        { title: "camelCase", value: "camel-case" },
        { title: "snake_case", value: "snake-case" },
        { title: "PascalCase", value: "pascal-case" }
      ]
    }
  ]);
  if (!response.architecture) {
    logger.warn("Initialization cancelled.");
    return;
  }
  const rootPath = path11.resolve(cwd, response.root);
  const srcPath = path11.resolve(rootPath, response.srcDir);
  await fs8.ensureDir(rootPath);
  await fs8.ensureDir(srcPath);
  const config = {
    $schema: "https://servercn.dev/schema/v1.json",
    version: "1.0.0",
    project: {
      root: response.root,
      srcDir: response.srcDir,
      type: "backend",
      packageManager: response.packageManager
    },
    stack: {
      runtime: "node",
      language: response.language,
      framework: response.framework,
      architecture: response.architecture
    },
    database: response.databaseType === "none" ? null : {
      type: response.databaseType,
      orm: response.orm
    },
    conventions: {
      fileNaming: "kebab-case",
      functionNaming: "camel-case",
      envFile: ".env",
      testDir: "__tests__"
    },
    overrides: {},
    meta: {
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      createdBy: "servercn@1.0.0"
    }
  };
  await fs8.writeJson(path11.join(rootPath, CONFIG_FILE2), config, { spaces: 2 });
  logger.success("\nSuccess! ServerCN initialized successfully.");
  logger.info(`Root directory: ${response.root}`);
  logger.info(`Source directory: ${response.srcDir}`);
  logger.info("You may now add components by running:");
  logger.info("- servercn add <component>\n");
}

// src/lib/registry-list.ts
import fs9 from "fs-extra";
import path12 from "path";
async function loadRegistryComponents() {
  const registryDir = getRegistryPath();
  const files = await fs9.readdir(registryDir);
  const components = [];
  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    const fullPath = path12.join(registryDir, file);
    const data = await fs9.readJSON(fullPath);
    components.push(data);
  }
  return components;
}

// src/lib/group-by-category.ts
function groupByCategory(components) {
  return components.reduce((acc, c) => {
    const category = c.category ?? "uncategorized";
    acc[category] ??= [];
    acc[category].push(c);
    return acc;
  }, {});
}

// src/commands/list.ts
async function list() {
  const components = await loadRegistryComponents();
  if (!components.length) {
    logger.warn("No components found in registry.");
    return;
  }
  const grouped = groupByCategory(components);
  for (const category of Object.keys(grouped).sort()) {
    logger.info(`
${category.toUpperCase()}`);
    const items = grouped[category].sort(
      (a, b) => a.name.localeCompare(b.name)
    );
    for (const c of items) {
      logger.log(`  \u2022 ${c.name} \u2014 ${c.title}`);
    }
  }
}

// src/cli.ts
var program = new Command();
process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));
async function main() {
  program.name("servercn").description("Backend components for Node.js").version("0.0.1");
  program.command("init").description("Initialize ServerCN in your project").action(init);
  program.command("list").description("List available ServerCN components").action(list);
  program.command("add <component>").description("Add a backend component").option("--arch <arch>", "Architecture (mvc | feature | clean)", "mvc").option("-f, --force", "Overwrite existing files").option("--dry-run", "Preview changes without writing").action((component, options) => {
    return add(component, {
      arch: options.arch
    });
  });
  program.parse(process.argv);
}
main().catch((err) => {
  console.error(err);
  process.exit(1);
});
//# sourceMappingURL=cli.js.map