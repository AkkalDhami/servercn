#!/usr/bin/env node

// src/cli.ts
import { Command } from "commander";

// src/commands/add.ts
import path10 from "path";
import prompts from "prompts";

// src/lib/paths.ts
import path from "path";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
function getServercnRoot() {
  return path.resolve(__dirname, "../../..");
}
function getRegistryPath(folder) {
  const folderName = folder ? `/${folder}s` : "";
  return path.join(getServercnRoot(), `packages/registry${folderName}`);
}
function getTemplatesPath() {
  return path.join(getServercnRoot(), `packages/templates/`);
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
  created: kleur.magenta,
  overwritten: kleur.yellow
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
    console.log(colors.created(`Created: ${args.join(" ")}`));
  },
  overwritten(...args) {
    console.log(colors.overwritten(`Overwritten: ${args.join(" ")}`));
  },
  muted(...args) {
    console.log(colors.muted(`${args.join(" ")}`));
  },
  break() {
    console.log("");
  }
};

// src/lib/copy.ts
async function copyTemplate({
  templateDir,
  targetDir,
  componentName,
  conflict = "skip",
  dryRun = false
}) {
  if (!await fs.pathExists(templateDir)) {
    logger.error(`Template not found: ${templateDir}`);
    process.exit(1);
  }
  await fs.ensureDir(targetDir);
  const entries = await fs.readdir(templateDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path2.join(templateDir, entry.name);
    let rawName = entry.name === "_gitignore" ? ".gitignore" : entry.name;
    let finalName = rawName;
    const destPath = path2.join(targetDir, finalName);
    const relativeDestPath = path2.relative(process.cwd(), destPath);
    if (entry.isDirectory()) {
      await copyTemplate({
        templateDir: srcPath,
        targetDir: destPath,
        componentName,
        conflict,
        dryRun
      });
      continue;
    }
    const exists = await fs.pathExists(destPath);
    if (exists) {
      if (conflict === "skip") {
        logger.warn(`Skipped: ${relativeDestPath}`);
        continue;
      }
      if (conflict === "error") {
        throw new Error(`File already exists: ${relativeDestPath}`);
      }
    }
    if (dryRun) {
      logger.info(
        `[dry-run] ${exists ? "OVERWRITE" : "CREATE"}: ${relativeDestPath}`
      );
      continue;
    }
    const buffer = await fs.readFile(srcPath);
    const isBinary = buffer.includes(0);
    await fs.ensureDir(path2.dirname(destPath));
    if (isBinary) {
      await fs.copyFile(srcPath, destPath);
    } else {
      let content = buffer.toString("utf8");
      await fs.writeFile(destPath, content);
    }
    exists ? logger.overwritten(relativeDestPath) : logger.created(relativeDestPath);
  }
}

// src/lib/registry.ts
import fs2 from "fs-extra";
import path3 from "path";
async function getRegistryComponent(name, type) {
  const registryPath = getRegistryPath(type);
  const filePath = path3.join(registryPath, `${name}.json`);
  if (!await fs2.pathExists(filePath)) {
    logger.error(`${type} "${name}" not found`);
    process.exit(1);
  }
  return fs2.readJSON(filePath);
}

// src/lib/architecture.ts
import path4 from "path";
function resolveTargetDir(folderName) {
  const cwd = process.cwd();
  return path4.join(cwd, folderName);
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

// src/lib/assert-initialized.ts
import fs6 from "fs-extra";
import path8 from "path";

// src/constants/app-constants.ts
var SERVERCN_CONFIG_FILE = "servercn.config.json";

// src/configs/env.ts
import { z } from "zod";
import "dotenv/config";
var envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  SERVERCN_SILENT: z.string().default("true"),
  LOG_LEVEL: z.string().default("info"),
  SERVERCN_URL: z.string().default("https://servercn.vercel.app")
});
var parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error(
    "\u274C Invalid environment variables:",
    z.treeifyError(parsed.error)
  );
  process.exit(1);
}
var env = parsed.data;

// src/lib/assert-initialized.ts
async function assertInitialized() {
  const configPath = path8.resolve(process.cwd(), SERVERCN_CONFIG_FILE);
  if (!await fs6.pathExists(configPath)) {
    logger.error("ServerCN is not initialized in this project.");
    logger.info("Run the following command first:");
    logger.log("- npx servercn init");
    logger.muted("For express server: npx servercn init express-server");
    logger.muted(
      "For (Drizzle + MySQL) Starter: npx servercn init drizzle-mysql-server"
    );
    logger.muted(
      "For (Drizzle + PostgreSQL) Starter: npx servercn init drizzle-pg-server"
    );
    logger.muted(
      `Visit ${env.SERVERCN_URL}/docs/installation for more information`
    );
    process.exit(1);
  }
}

// src/lib/config.ts
import fs7 from "fs-extra";
import path9 from "path";
async function getServerCNConfig() {
  const cwd = process.cwd();
  const configPath = path9.resolve(cwd, SERVERCN_CONFIG_FILE);
  if (!await fs7.pathExists(configPath)) {
    logger.warn("ServerCN is not initialized. Run `servercn init` first.");
    process.exit(1);
  }
  return fs7.readJSON(configPath);
}
function getDatabaseConfig(foundation) {
  switch (foundation) {
    case "express-server":
    case "mongoose-starter":
      return { type: "mongodb", orm: "mongoose" };
    case "drizzle-mysql-starter":
      return { type: "mysql", orm: "drizzle" };
    case "drizzle-pg-starter":
      return { type: "postgresql", orm: "drizzle" };
    case "prisma-mongo-starter":
      return { type: "mongodb", orm: "prisma" };
    case "prisma-pg-starter":
      return { type: "postgresql", orm: "prisma" };
    default:
      return null;
  }
}

// src/utils/capatalize.ts
function capitalize(text) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// src/commands/add.ts
async function add(componentName, options = {}) {
  await assertInitialized();
  const config = await getServerCNConfig();
  const type = options.type ?? "component";
  const component = await getRegistryComponent(componentName, type);
  if (!component.stacks.includes(config.stack.framework)) {
    logger.error(
      `${type === "schema" ? "Schema" : "Component"} "${componentName}" does not support "${config.stack.framework}"`
    );
    process.exit(1);
  }
  const stack = config.stack.framework;
  const arch = config.stack.architecture;
  const targetDir = resolveTargetDir(".");
  if (!targetDir) {
    logger.error("Failed to resolve target directory");
    process.exit(1);
  }
  let templateDir;
  let runtimeDeps;
  const devDeps = component.dependencies?.dev;
  if (component.algorithms && type !== "schema") {
    const choices = Object.entries(component.algorithms).map(
      ([key, value]) => ({
        title: value.title,
        value: key
      })
    );
    const { algorithm } = await prompts({
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
        `Architecture "${arch}" is not supported for "${component.title}"`
      );
      process.exit(1);
    }
    templateDir = path10.resolve(getTemplatesPath(), selectedTemplate);
    runtimeDeps = algoConfig.dependencies?.runtime;
    logger.info(`Using algorithm: ${algoConfig.title}`);
  } else {
    const templateConfig = component.templates?.[stack];
    if (!templateConfig) {
      logger.error(`Stack "${stack}" is not supported by "${component.title}"`);
      process.exit(1);
    }
    let selectedTemplate;
    if (type === "schema") {
      const database = config.database?.type;
      const databaseOrm = config.database?.orm;
      if (!database || !databaseOrm) {
        logger.error(
          "Database not configured in servercn.config.json. Please run init first."
        );
        process.exit(1);
      }
      const dbConfig = templateConfig[database];
      if (!dbConfig || !dbConfig[databaseOrm]) {
        logger.error(
          `Database "${database}-${databaseOrm}" is not supported by "${component.slug}"`
        );
        process.exit(1);
      }
      const dbArchOptions = dbConfig[databaseOrm];
      const archConfig = dbArchOptions[arch] ?? dbArchOptions.base;
      if (!archConfig) {
        logger.error(
          `Architecture "${arch}" is not supported for schema "${component.slug}" on ${database}`
        );
        process.exit(1);
      }
      const variant = options.variant || "advanced";
      selectedTemplate = typeof archConfig === "string" ? archConfig : archConfig[variant];
      if (!selectedTemplate) {
        logger.error(
          `Variant "${variant}" is not supported for schema "${component.slug}"`
        );
        process.exit(1);
      }
    } else {
      selectedTemplate = typeof templateConfig === "string" ? templateConfig : templateConfig[arch];
    }
    if (!selectedTemplate) {
      logger.error(
        `Architecture "${arch}" is not supported by "${component.slug}"`
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
  logger.success(
    `
Success! ${capitalize(component.type)} ${component.title} added successfully
`
  );
}

// src/commands/init.ts
import fs8 from "fs-extra";
import path11 from "path";
import prompts2 from "prompts";
import { execa as execa2 } from "execa";
async function init(foundation) {
  const cwd = process.cwd();
  const configPath = path11.join(cwd, SERVERCN_CONFIG_FILE);
  if (await fs8.pathExists(configPath) && !foundation) {
    logger.warn("ServerCN is already initialized in this project.");
    logger.info("You can now run: servercn add <component>");
    process.exit(1);
  }
  const tsConfig = {
    compilerOptions: {
      target: "ES2021",
      module: "es2022",
      moduleResolution: "bundler",
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      outDir: "dist",
      rootDir: "src"
    },
    include: ["src/**/*"],
    exclude: ["node_modules"]
  };
  if (foundation) {
    const response2 = await prompts2([
      {
        type: "text",
        name: "root",
        message: "Project root directory",
        initial: ".",
        format: (val) => val.trim() || "."
      },
      {
        type: "select",
        name: "architecture",
        message: "Select architecture",
        choices: [
          { title: "MVC (controllers, services, models)", value: "mvc" },
          { title: "Feature-based (domain-driven modules)", value: "feature" }
        ]
      },
      {
        type: "confirm",
        name: "initGit",
        message: "Initialize git repository?",
        initial: true
      }
    ]);
    const rootPath2 = path11.resolve(cwd, response2.root);
    await fs8.ensureDir(rootPath2);
    if (!fs8.pathExistsSync(rootPath2)) {
      logger.error(`Failed to create project directory: ${rootPath2}`);
      process.exit(1);
    }
    if (response2.initGit) {
      try {
        await execa2("git", ["init"], { cwd: rootPath2 });
        logger.info("Initialized git repository.");
      } catch (error) {
        logger.warn("Failed to initialize git repository. Is git installed?");
      }
    }
    logger.info(`Initializing with foundation: ${foundation}`);
    try {
      const component = await getRegistryComponent(foundation, "foundation");
      const config2 = {
        version: "1.0.0",
        project: {
          root: response2.root,
          srcDir: "src",
          type: "backend"
        },
        stack: {
          runtime: "node",
          language: "typescript",
          framework: "express",
          architecture: response2.architecture
        },
        database: getDatabaseConfig(foundation),
        overrides: {},
        meta: {
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          createdBy: "servercn@1.0.0"
        }
      };
      const prettierConfig = {
        singleQuote: false,
        semi: true,
        tabWidth: 2,
        trailingComma: "none",
        bracketSameLine: false,
        arrowParens: "avoid",
        endOfLine: "lf"
      };
      const commitlintConfig = {
        extends: ["@commitlint/config-conventional"],
        rules: {
          "type-enum": [
            2,
            "always",
            [
              "feat",
              "fix",
              "docs",
              "style",
              "refactor",
              "test",
              "chore",
              "ci",
              "perf",
              "build",
              "release",
              "workflow",
              "security"
            ]
          ],
          "subject-case": [2, "always", ["lower-case"]]
        }
      };
      await fs8.writeJson(path11.join(rootPath2, SERVERCN_CONFIG_FILE), config2, {
        spaces: 2
      });
      await fs8.writeJson(path11.join(rootPath2, ".prettierrc"), prettierConfig, {
        spaces: 2
      });
      await fs8.writeFile(
        path11.join(rootPath2, ".prettierignore"),
        `build
dist
.env
node_modules`
      );
      await fs8.writeJson(path11.join(rootPath2, "tsconfig.json"), tsConfig, {
        spaces: 2
      });
      await fs8.writeFile(
        path11.join(rootPath2, "commitlint.config.ts"),
        `export default ${JSON.stringify(commitlintConfig, null, 2)}`
      );
      const templatePathRelative = component.templates?.express?.[response2.architecture];
      if (!templatePathRelative) {
        throw new Error(
          `Template not found for ${foundation} (express/${response2.architecture})`
        );
      }
      const templateDir = path11.resolve(
        getTemplatesPath(),
        templatePathRelative
      );
      await copyTemplate({
        templateDir,
        targetDir: rootPath2,
        componentName: foundation,
        conflict: "overwrite"
      });
      await installDependencies({
        runtime: component.dependencies?.runtime,
        dev: component.dependencies?.dev,
        cwd: rootPath2
      });
      logger.success(`
Success! ServerCN initialized with ${foundation}.`);
      logger.info("Configure environment variables in .env file.");
      logger.log("Run the following commands:");
      if (response2.root === ".") {
        logger.muted(`1. npm run dev`);
      } else {
        logger.muted(`1. cd ${response2.root}`);
        logger.muted(`2. npm run dev`);
      }
      return;
    } catch (error) {
      logger.error(`Failed to initialize foundation: ${error}`);
      process.exit(1);
    }
  }
  const response = await prompts2([
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
        { title: "MVC (controllers, services, models)", value: "mvc" },
        { title: "Feature-based (domain-driven modules)", value: "feature" }
      ]
    },
    {
      type: "select",
      name: "language",
      message: "Programming language",
      choices: [
        {
          title: "TypeScript (recommended)",
          value: "typescript"
        }
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
        {
          title: "MongoDB",
          value: "mongodb"
        },
        {
          title: "PostgreSQL",
          value: "postgresql"
        },
        {
          title: "MySQL",
          value: "mysql"
        }
      ]
    },
    {
      type: (prev) => prev === "mongodb" ? "select" : null,
      name: "orm",
      message: "MongoDB library",
      choices: [{ title: "Mongoose", value: "mongoose" }]
    },
    {
      type: (_prev, values) => ["postgresql", "mysql"].includes(values.databaseType) ? "select" : null,
      name: "orm",
      message: "ORM / Query builder",
      choices: [
        { title: "Drizzle", value: "drizzle" }
        // { title: "Prisma", value: "prisma" }
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
    version: "1.0.0",
    project: {
      root: response.root,
      srcDir: response.srcDir,
      type: "backend"
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
    overrides: {},
    meta: {
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      createdBy: "servercn@1.0.0"
    }
  };
  await fs8.writeJson(path11.join(rootPath, SERVERCN_CONFIG_FILE), config, {
    spaces: 2
  });
  await fs8.writeJson(path11.join(rootPath, "tsconfig.json"), tsConfig, {
    spaces: 2
  });
  logger.success("\nSuccess! ServerCN initialized successfully.");
  logger.log("You may now add components by running:");
  if (response.root === ".") {
    logger.muted("1. npx servercn add <component>");
  } else {
    logger.muted(`1. cd ${response.root}`);
    logger.muted("2. npx servercn add <component>");
  }
  logger.muted("Ex: npx servercn add jwt-utils file-upload");
}

// src/lib/registry-list.ts
import fs9 from "fs-extra";
import path12 from "path";
async function loadRegistry(type) {
  const registryDir = getRegistryPath(type);
  const files = await fs9.readdir(registryDir);
  const components = [];
  for (const file of files) {
    let nestedFiles = [];
    if (!file.endsWith(".json")) {
      nestedFiles = await fs9.readdir(path12.join(registryDir, file));
      for (const nestedFile of nestedFiles) {
        if (!nestedFile.endsWith(".json")) continue;
        const fullPath = path12.join(registryDir, file, nestedFile);
        const data = await fs9.readJSON(fullPath);
        components.push(data);
      }
    } else {
      const fullPath = path12.join(registryDir, file);
      const data = await fs9.readJSON(fullPath);
      components.push(data);
    }
  }
  return components;
}

// src/lib/group-by-category.ts
function groupByCategory(components) {
  return components.reduce((acc, c) => {
    const category = c.type ?? "uncategorized";
    acc[category] ??= [];
    acc[category].push(c);
    return acc;
  }, {});
}

// src/commands/list.ts
async function renderGrouppedRegistries(type, logs) {
  const components = await loadRegistry(type);
  const groupedComponents = groupByCategory(components);
  let i = 1;
  for (const category of Object.keys(groupedComponents).sort()) {
    logger.info(`
${category.toUpperCase()}S`);
    const items = groupedComponents[category].sort(
      (a, b) => a.title.localeCompare(b.title)
    );
    for (const c of items) {
      logger.log(`${i++}. ${c.title}: ${c.slug}`);
    }
    logger.break();
    logs && logs.map((log) => logger.muted(log));
  }
}
async function list() {
  const componentLogs = [
    "To add components run: npx servercn add <component-name>",
    "Ex: npx servercn add http-status-codes",
    "Ex: npx servercn add jwt-utils rbac verify-auth-middleware",
    `For more info, visit: ${env.SERVERCN_URL}/components`
  ];
  const foundationLogs = [
    "To add foundation run: npx servercn init <foundation-name>",
    "Ex: npx servercn init express-server",
    "Ex: npx servercn init drizzle-mysql-starter",
    `For more info, visit: ${env.SERVERCN_URL}/foundations`
  ];
  const blueprintLogs = [
    "To add blueprint run: npx servercn add blueprint <blueprint-name>",
    "Ex: npx servercn add blueprint jwt-utils rbac verify-auth-middleware",
    `For more info, visit: ${env.SERVERCN_URL}/blueprints`
  ];
  const schemaLogs = [
    "To add schema run: npx servercn add schema <schema-name>",
    "Ex: npx servercn add schema auth/user",
    "Ex: npx servercn add schema auth/otp",
    "Ex: npx servercn add schema auth/session",
    `For more info, visit: ${env.SERVERCN_URL}/schemas`
  ];
  await renderGrouppedRegistries("component", componentLogs);
  await renderGrouppedRegistries("foundation", foundationLogs);
  await renderGrouppedRegistries("blueprint", blueprintLogs);
  await renderGrouppedRegistries("schema", schemaLogs);
}

// src/cli.ts
var program = new Command();
process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));
async function main() {
  program.name("servercn").description("Backend components for Node.js").version("0.0.1");
  program.command("init [foundation]").description("Initialize ServerCN in your project").action(init);
  program.command("list").description("List available ServerCN components").action(list);
  program.command("add <components...>").description("Add a backend component").option("--arch <arch>", "Architecture (mvc | feature)", "mvc").option("--variant <variant>", "Variant (advanced | minimal)", "advanced").option("-f, --force", "Overwrite existing files").action(async (components, options) => {
    let type = "component";
    let items = components;
    if (components[0] === "schema") {
      type = "schema";
      console.log({ components });
      console.log(components.slice(1)[0]);
      if (components.slice(1)[0].includes("auth/")) {
        items = components.slice(1);
      } else {
        items = [`${components.slice(1)}/index`];
      }
    } else if (components[0] === "blueprint") {
      type = "blueprint";
      items = components.slice(1);
    }
    for (const item of items) {
      await add(item, {
        arch: options.arch,
        variant: options.variant,
        type,
        force: options.force
      });
    }
  });
  program.parse(process.argv);
}
main().catch((err) => {
  console.error(err);
  process.exit(1);
});
//# sourceMappingURL=cli.js.map