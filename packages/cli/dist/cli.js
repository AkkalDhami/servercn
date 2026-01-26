#!/usr/bin/env node

// src/cli.ts
import { Command } from "commander";

// src/commands/add.ts
import path10 from "path";
import prompts from "prompts";

// src/lib/copy.ts
import fs from "fs-extra";
import path from "path";

// src/utils/logger.ts
import kleur from "kleur";
var logger = {
  log(...args) {
    console.log(args.join(" "));
  },
  break() {
    console.log("");
  },
  created: (msg) => console.log(kleur.blue("\u2714 created: " + msg)),
  info: (msg) => console.log(kleur.cyan(msg)),
  success: (msg) => console.log("\n" + kleur.green("\u2714 success! " + msg)),
  skip: (msg) => console.log(kleur.yellow("\u21BA skip: " + msg)),
  error: (msg) => console.log(kleur.red("\u2716 " + msg)),
  muted: (msg) => console.log(kleur.dim(msg)),
  warn: (msg) => console.log(kleur.yellow("\u26A0 " + msg)),
  overwritten: (msg) => console.log(kleur.yellow("overwrite: " + msg)),
  section: (title) => {
    console.log("\n" + title);
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
    logger.error(`template not found: ${templateDir}`);
    process.exit(1);
  }
  await fs.ensureDir(targetDir);
  const entries = await fs.readdir(templateDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(templateDir, entry.name);
    let rawName = entry.name === "_gitignore" ? ".gitignore" : entry.name;
    let finalName = rawName;
    const destPath = path.join(targetDir, finalName);
    const relativeDestPath = path.relative(process.cwd(), destPath);
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
        logger.skip(`${relativeDestPath} (already exists)`);
        continue;
      }
      if (conflict === "error") {
        throw new Error(`file already exists: ${relativeDestPath}`);
      }
    }
    if (dryRun) {
      logger.info(
        `[dry-run] ${exists ? "overwrite" : "create"}: ${relativeDestPath}`
      );
      continue;
    }
    const buffer = await fs.readFile(srcPath);
    const isBinary = buffer.includes(0);
    await fs.ensureDir(path.dirname(destPath));
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

// src/lib/paths.ts
import path2 from "path";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path2.dirname(__filename);
function getServercnRoot() {
  return path2.resolve(__dirname, "../");
}
var paths = {
  root: getServercnRoot(),
  registry: (f) => path2.join(getServercnRoot(), "registry", f ? `${f}s` : ""),
  templates: () => path2.join(getServercnRoot(), "templates")
};

// src/lib/registry.ts
async function getRegistryComponent(name, type) {
  const registryPath = paths.registry(type);
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
    logger.info(`installing dependencies: ${args.join(" ")}`);
    await execa(pm, args, {
      cwd,
      stdio: "inherit"
    });
  };
  if (runtime.length) {
    logger.section("runtime dependencies");
    await run(getInstallArgs(pm, runtime, false));
    logger.success(
      `${runtime.length} runtime dependencies installed successfully`
    );
  }
  if (dev.length) {
    logger.section("dev dependencies");
    await run(getInstallArgs(pm, dev, true));
    logger.success(`${dev.length} dev dependencies installed successfully`);
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
  logger.section("Environment");
  logger.log(`updated .env.example`);
  logger.log(`configure environment variables in .env file.`);
}

// src/lib/package.ts
import fs5 from "fs";
import path7 from "path";
import { execSync } from "child_process";
function ensurePackageJson(dir) {
  const pkgPath = path7.join(dir, "package.json");
  if (fs5.existsSync(pkgPath)) return;
  logger.info("initializing package.json");
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
    logger.error("servercn is not initialized in this project.");
    logger.info("run the following command first:");
    logger.log("=> npx servercn init");
    logger.muted("for express server: npx servercn init express-server");
    logger.muted(
      "for (drizzle + mysql) starter: npx servercn init drizzle-mysql-starter"
    );
    logger.muted(
      "for (drizzle + postgresql) starter: npx servercn init drizzle-pg-starter"
    );
    logger.muted(
      `visit ${env.SERVERCN_URL}/docs/installation for more information`
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
    logger.error("failed to resolve target directory");
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
      logger.warn("operation cancelled");
      return;
    }
    const algoConfig = component.algorithms[algorithm];
    const selectedTemplate = algoConfig.templates?.[arch] ?? algoConfig.templates?.base;
    if (!selectedTemplate) {
      logger.error(
        `architecture "${arch}" is not supported for "${component.title}"`
      );
      process.exit(1);
    }
    templateDir = path10.resolve(paths.templates(), selectedTemplate);
    runtimeDeps = algoConfig.dependencies?.runtime;
    logger.info(`using algorithm: ${algoConfig.title}`);
  } else {
    const templateConfig = component.templates?.[stack];
    if (!templateConfig) {
      logger.error(`stack "${stack}" is not supported by "${component.title}"`);
      process.exit(1);
    }
    let selectedTemplate;
    if (type === "schema") {
      const database = config.database?.type;
      const databaseOrm = config.database?.orm;
      if (!database || !databaseOrm) {
        logger.error(
          "database not configured in servercn.config.json. please run init first."
        );
        process.exit(1);
      }
      const dbConfig = templateConfig[database];
      if (!dbConfig || !dbConfig[databaseOrm]) {
        logger.error(
          `database "${database}-${databaseOrm}" is not supported by "${component.slug}"`
        );
        process.exit(1);
      }
      const dbArchOptions = dbConfig[databaseOrm];
      const archConfig = dbArchOptions[arch] ?? dbArchOptions.base;
      if (!archConfig) {
        logger.error(
          `architecture "${arch}" is not supported for schema "${component.slug}" on ${database}`
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
        `architecture "${arch}" is not supported by "${component.slug}"`
      );
      process.exit(1);
    }
    templateDir = path10.resolve(paths.templates(), selectedTemplate);
    runtimeDeps = component.dependencies?.runtime;
  }
  logger.section("copying files");
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
  logger.success(`${component.type}: ${component.slug} added successfully
`);
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
    logger.warn("servercn is already initialized in this project.");
    logger.info("you can now run: servercn add <component>");
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
        logger.info("initialized git repository.");
      } catch (error) {
        logger.warn("failed to initialize git repository. is git installed?");
      }
    }
    logger.info(`initializing with foundation: ${foundation}`);
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
      await fs8.writeFile(
        path11.join(rootPath2, ".gitignore"),
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
          `template not found for ${foundation.toLowerCase()} (express/${response2.architecture})`
        );
      }
      const templateDir = path11.resolve(paths.templates(), templatePathRelative);
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
      logger.success(`servercn initialized with ${foundation}.`);
      logger.info("configure environment variables in .env file.");
      logger.log("run the following commands:");
      if (response2.root === ".") {
        logger.muted(`1. npm run dev
`);
      } else {
        logger.muted(`1. cd ${response2.root}`);
        logger.muted(`2. npm run dev
`);
      }
      return;
    } catch (error) {
      logger.error(`failed to initialize foundation: ${error}`);
      process.exit(1);
    }
  }
  const response = await prompts2([
    {
      type: "text",
      name: "root",
      message: "project root directory",
      initial: ".",
      format: (val) => val.trim() || "."
    },
    {
      type: "text",
      name: "srcDir",
      message: "source directory",
      initial: "src",
      format: (val) => val.trim() || "src"
    },
    {
      type: "select",
      name: "architecture",
      message: "select architecture",
      choices: [
        { title: "MVC (controllers, services, models)", value: "mvc" },
        { title: "Feature-based (domain-driven modules)", value: "feature" }
      ]
    },
    {
      type: "select",
      name: "language",
      message: "programming language",
      choices: [
        {
          title: "typescript (recommended)",
          value: "typescript"
        }
      ]
    },
    {
      type: "select",
      name: "framework",
      message: "backend framework",
      choices: [{ title: "express", value: "express" }]
    },
    {
      type: "select",
      name: "databaseType",
      message: "select database",
      choices: [
        {
          title: "mongodb",
          value: "mongodb"
        },
        {
          title: "postgresql",
          value: "postgresql"
        },
        {
          title: "mysql",
          value: "mysql"
        }
      ]
    },
    {
      type: (prev) => prev === "mongodb" ? "select" : null,
      name: "orm",
      message: "mongodb library",
      choices: [{ title: "mongoose", value: "mongoose" }]
    },
    {
      type: (_prev, values) => ["postgresql", "mysql"].includes(values.databaseType) ? "select" : null,
      name: "orm",
      message: "orm / query builder",
      choices: [
        { title: "drizzle", value: "drizzle" }
        // { title: "prisma", value: "prisma" }
      ]
    }
  ]);
  if (!response.architecture) {
    logger.warn("initialization cancelled.");
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
  logger.success("servercn initialized successfully.");
  logger.log("you may now add components by running:");
  if (response.root === ".") {
    logger.muted("1. npx servercn add <component>");
  } else {
    logger.muted(`1. cd ${response.root}`);
    logger.muted("2. npx servercn add <component>");
  }
  logger.muted(
    "ex: npx servercn add jwt-utils error-handler http-status-codes"
  );
}

// src/lib/registry-list.ts
import fs9 from "fs-extra";
import path12 from "path";
async function loadRegistry(type) {
  const registryDir = paths.registry(type);
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
${category.toLowerCase()}s`);
    const items = groupedComponents[category].sort(
      (a, b) => a.title.localeCompare(b.title)
    );
    for (const c of items) {
      logger.log(`${i++}. ${c.title.toLowerCase()}: ${c.slug}`);
    }
    logger.break();
    logs && logs.map((log) => logger.muted(log));
  }
}
async function list() {
  const componentLogs = [
    "to add components run: npx servercn add <component-name>",
    "ex: npx servercn add http-status-codes",
    "ex: npx servercn add jwt-utils rbac verify-auth-middleware",
    `for more info, visit: ${env.SERVERCN_URL}/components`
  ];
  const foundationLogs = [
    "to add foundation run: npx servercn init <foundation-name>",
    "ex: npx servercn init express-server",
    "ex: npx servercn init drizzle-mysql-starter",
    `for more info, visit: ${env.SERVERCN_URL}/foundations`
  ];
  const blueprintLogs = [
    "to add blueprint run: npx servercn add blueprint <blueprint-name>",
    "ex: npx servercn add blueprint jwt-utils rbac verify-auth-middleware",
    `for more info, visit: ${env.SERVERCN_URL}/blueprints`
  ];
  const schemaLogs = [
    "to add schema run: npx servercn add schema <schema-name>",
    "ex: npx servercn add schema auth/user",
    "ex: npx servercn add schema auth/otp",
    "ex: npx servercn add schema auth/session",
    `for more info, visit: ${env.SERVERCN_URL}/schemas`
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