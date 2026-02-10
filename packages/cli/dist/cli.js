#!/usr/bin/env node

// src/cli.ts
import { Command } from "commander";

// src/commands/add.ts
import path11 from "path";
import prompts from "prompts";
import { execa as execa2 } from "execa";

// src/lib/copy.ts
import fs from "fs-extra";
import path from "path";

// src/utils/highlighter.ts
import kleur from "kleur";
var highlighter = {
  error: kleur.red,
  warn: kleur.yellow,
  info: kleur.cyan,
  success: kleur.green,
  create: kleur.blue,
  mute: kleur.dim
};

// src/utils/logger.ts
var logger = {
  error(...args) {
    console.log(highlighter.error(args.join(" ")));
  },
  warn(...args) {
    console.log(highlighter.warn(args.join(" ")));
  },
  info(...args) {
    console.log(highlighter.info(args.join(" ")));
  },
  success(...args) {
    console.log(highlighter.success(args.join(" ")));
  },
  log(...args) {
    console.log(args.join(" "));
  },
  break() {
    console.log("");
  },
  section: (title) => {
    console.log("\n" + title);
  },
  muted: (msg) => console.log(highlighter.mute(msg)),
  created: (msg) => console.log(highlighter.create("Create: " + msg))
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
        logger.warn(`Skip: ${relativeDestPath} (already exists)`);
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
    exists ? logger.warn(`Skip: ${relativeDestPath}`) : logger.created(`Create: ${relativeDestPath}`);
  }
}

// src/lib/registry.ts
import fs3 from "fs-extra";
import path4 from "path";

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

// src/lib/registry-list.ts
import fs2 from "fs-extra";
import path3 from "path";
async function loadRegistry(type) {
  const registryDir = paths.registry(type);
  const files = await fs2.readdir(registryDir);
  const components = [];
  for (const file of files) {
    let nestedFiles = [];
    if (!file.endsWith(".json")) {
      nestedFiles = await fs2.readdir(path3.join(registryDir, file));
      for (const nestedFile of nestedFiles) {
        if (!nestedFile.endsWith(".json")) continue;
        const fullPath = path3.join(registryDir, file, nestedFile);
        const data = await fs2.readJSON(fullPath);
        components.push(data);
      }
    } else {
      const fullPath = path3.join(registryDir, file);
      const data = await fs2.readJSON(fullPath);
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

// src/configs/env.ts
import { z } from "zod";
import "dotenv/config";
var envSchema = z.object({
  NODE_ENV: z.string().default("development"),
  SERVERCN_SILENT: z.string().default("true"),
  LOG_LEVEL: z.string().default("info"),
  SERVERCN_URL: z.string().default("https://servercn.vercel.app")
});
var parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error(
    "\u274C Invalid environment variables:",
    z.prettifyError(parsed.error)
  );
  process.exit(1);
}
var env = parsed.data;

// src/constants/app-constants.ts
var SERVERCN_CONFIG_FILE = "servercn.config.json";
var APP_NAME = "ServerCN";
var LATEST_VERSION = "1.0.0";

// src/utils/log.ts
var componentLogs = [
  `To Add ${APP_NAME} Component Run: npx servercn add <component-name>`,
  "ex: npx servercn add http-status-codes",
  "ex: npx servercn add jwt-utils rbac verify-auth-middleware",
  `For more info, Visit: ${env.SERVERCN_URL}/components`
];
var foundationLogs = [
  `To Add ${APP_NAME} Foundation Run: npx servercn init <foundation-name>`,
  "ex: npx servercn init express-server",
  "ex: npx servercn init drizzle-mysql-starter",
  "ex: npx servercn init drizzle-pg-starter",
  `For more info, Visit: ${env.SERVERCN_URL}/foundations`
];
var blueprintLogs = [
  `To Add ${APP_NAME} Blueprint Run: npx servercn add blueprint <blueprint-name>`,
  "ex: npx servercn add blueprint stateless-auth",
  `For more info, Visit: ${env.SERVERCN_URL}/blueprints`
];
var schemaLogs = [
  `To Add ${APP_NAME} Schema Run: npx servercn add schema <schema-name>`,
  "ex: npx servercn add schema auth",
  "ex: npx servercn add schema auth/user",
  "ex: npx servercn add schema auth/otp",
  "ex: npx servercn add schema auth/session",
  `For more info, Visit: ${env.SERVERCN_URL}/schemas`
];
var toolingLogs = [
  `To Add ${APP_NAME} Tooling Run: npx servercn add tooling <tooling-name>`,
  "ex: npx servercn add tooling commitlint",
  "ex: npx servercn add tooling eslint husky prettier",
  `For more info, Visit: ${env.SERVERCN_URL}`
];
function logInfo(type) {
  switch (type) {
    case "component":
      return componentLogs;
    case "blueprint":
      return blueprintLogs;
    case "schema":
      return schemaLogs;
    case "foundation":
      return foundationLogs;
    case "tooling":
      return toolingLogs;
    default:
      return componentLogs;
  }
}

// src/utils/capitalize.ts
function capitalize(name) {
  return name.split("")[0].toUpperCase() + name.split("").slice(1).join("").toLowerCase();
}

// src/commands/list.ts
async function renderGrouppedRegistries(type, logs) {
  const components = await loadRegistry(type);
  const groupedComponents = groupByCategory(components);
  let i = 1;
  for (const category of Object.keys(groupedComponents).sort()) {
    logger.info(`
Available ${capitalize(category)}s:`);
    const items = groupedComponents[category].sort(
      (a, b) => a.title.localeCompare(b.title)
    );
    for (const c of items) {
      logger.log(`${i++}. ${capitalize(c.title)}: ${c.slug}`);
    }
    logger.break();
    logs && logs.map((log) => logger.muted(log));
  }
}
async function list() {
  await renderGrouppedRegistries("component", componentLogs);
  await renderGrouppedRegistries("foundation", foundationLogs);
  await renderGrouppedRegistries("blueprint", blueprintLogs);
  await renderGrouppedRegistries("schema", schemaLogs);
  await renderGrouppedRegistries("tooling", toolingLogs);
}

// src/lib/registry.ts
async function getRegistryComponent(name, type) {
  const registryPath = paths.registry(type);
  const filePath = path4.join(registryPath, `${name}.json`);
  if (!await fs3.pathExists(filePath)) {
    logger.break();
    logger.error("Something went wrong. Please check the error below for more details.");
    logger.error(`
${capitalize(type)} '${name}' not found!`);
    logger.error("\nCheck if the item name is correct.");
    await renderGrouppedRegistries(type, logInfo(type));
    process.exit(1);
  }
  return fs3.readJSON(filePath);
}

// src/lib/architecture.ts
import path5 from "path";
function resolveTargetDir(folderName) {
  const cwd = process.cwd();
  return path5.join(cwd, folderName);
}

// src/lib/install-deps.ts
import { execa } from "execa";

// src/lib/detect.ts
import fs4 from "fs";
import path6 from "path";
function detectPackageManager(cwd = process.cwd()) {
  if (fs4.existsSync(path6.join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (fs4.existsSync(path6.join(cwd, "yarn.lock"))) return "yarn";
  if (fs4.existsSync(path6.join(cwd, "bun.lockb"))) return "bun";
  return "npm";
}

// src/utils/spinner.ts
import ora from "ora";
function spinner(text, options) {
  return ora({
    text,
    isSilent: options?.silent
  });
}

// src/lib/install-deps.ts
async function installDependencies({
  runtime = [],
  dev = [],
  cwd
}) {
  if (!runtime.length && !dev.length) return;
  const pm = detectPackageManager();
  const result = spinner("Installing Dependencies")?.start();
  const run = async (args) => {
    await execa(pm, args, {
      cwd,
      stdio: "inherit"
    });
  };
  result?.succeed(`Installed ${runtime.length} ${runtime.length > 1 ? "Dependencies" : "Dependency"}`);
  await run(getInstallArgs(pm, runtime, false));
  await run(getInstallArgs(pm, dev, true));
  result?.succeed(`Installed ${dev.length} ${dev.length > 1 ? "DevDependencies" : "DevDependency"}`);
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
import fs5 from "fs";
import path7 from "path";
function updateEnvExample(envKeys = [], cwd = process.cwd()) {
  if (!envKeys.length) return;
  const envExamplePath = path7.join(cwd, ".env.example");
  const existing = fs5.existsSync(envExamplePath) ? fs5.readFileSync(envExamplePath, "utf8") : "";
  const existingKeys = new Set(
    existing.split("\n").map((line) => line.split("=")[0]?.trim()).filter(Boolean)
  );
  const newLines = envKeys.filter((key) => !existingKeys.has(key)).map((key) => `${key}=`);
  if (!newLines.length) return;
  const content = existing.trim().length > 0 ? `${existing.trim()}

${newLines.join("\n")}
` : `${newLines.join("\n")}
`;
  fs5.writeFileSync(envExamplePath, content, "utf8");
  logger.log(`Updated .env.example`);
  logger.info(`Configure your environment variables in .env file.`);
}

// src/lib/package.ts
import fs6 from "fs";
import path8 from "path";
import { execSync } from "child_process";
function ensurePackageJson(dir) {
  const pkgPath = path8.join(dir, "package.json");
  if (fs6.existsSync(pkgPath)) return;
  logger.info("initializing package.json");
  execSync("npm init -y", {
    cwd: dir,
    stdio: "ignore"
  });
}
function ensureTsConfig(dir) {
  const tsconfigPath = path8.join(dir, "tsconfig.json");
  if (fs6.existsSync(tsconfigPath)) return;
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
  fs6.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
}

// src/lib/assert-initialized.ts
import fs7 from "fs-extra";
import path9 from "path";
async function assertInitialized() {
  const configPath = path9.resolve(process.cwd(), SERVERCN_CONFIG_FILE);
  if (!await fs7.pathExists(configPath)) {
    logger.error(`${APP_NAME} is not initialized in this project.`);
    logger.info("Run the following command first:");
    logger.log("=> npx servercn init");
    logger.muted("For express server: npx servercn init express-server");
    logger.muted(
      "For (drizzle + mysql) starter: npx servercn init drizzle-mysql-starter"
    );
    logger.muted(
      "For (drizzle + postgresql) starter: npx servercn init drizzle-pg-starter"
    );
    logger.muted(
      `Visit ${env.SERVERCN_URL}/docs/installation for more information`
    );
    process.exit(1);
  }
}

// src/lib/config.ts
import fs8 from "fs-extra";
import path10 from "path";
async function getServerCNConfig() {
  const cwd = process.cwd();
  const configPath = path10.resolve(cwd, SERVERCN_CONFIG_FILE);
  if (!await fs8.pathExists(configPath)) {
    logger.warn("ServerCN is not initialized. Run `servercn init` first.");
    process.exit(1);
  }
  return fs8.readJSON(configPath);
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
  if (!componentName) {
    logger.error("Component name is required.");
    process.exit(1);
  }
  const type = options.type ?? "component";
  let component;
  if (type === "blueprint") {
    component = await getRegistryComponent(componentName, type);
  } else {
    component = await getRegistryComponent(componentName, type);
  }
  await assertInitialized();
  const config = await getServerCNConfig();
  if (!component.stacks.includes(config.stack.framework)) {
    logger.error(
      `${capitalize(type)} '${componentName}' does not support '${config.stack.framework}'.`
    );
    process.exit(1);
  }
  if (!component.architectures.includes(config.stack.architecture)) {
    logger.error(
      `${capitalize(type)} '${componentName}' does not support '${config.stack.architecture}'.`
    );
    process.exit(1);
  }
  const { templatePath, additionalRuntimeDeps, additionalDevDeps } = await resolveTemplateResolution(component, config, options);
  const templateDir = path11.resolve(paths.templates(), templatePath);
  const targetDir = resolveTargetDir(".");
  const result = spinner("Scaffolding Component Files")?.start();
  await copyTemplate({
    templateDir,
    targetDir,
    componentName,
    conflict: options.force ? "overwrite" : "skip",
    dryRun: options.dryRun
  });
  result.succeed("Scaffolding Component Files Successfully!");
  ensurePackageJson(process.cwd());
  ensureTsConfig(process.cwd());
  const runtimeDeps = [
    ...component.dependencies?.runtime ?? [],
    ...additionalRuntimeDeps
  ];
  const devDeps = [
    ...component.dependencies?.dev ?? [],
    ...additionalDevDeps
  ];
  await installDependencies({
    runtime: runtimeDeps,
    dev: devDeps,
    cwd: process.cwd()
  });
  await runPostInstallHooks(componentName, type, component);
  logger.success(`
${capitalize(type)}: ${component.slug} added successfully
`);
}
async function resolveTemplateResolution(component, config, options) {
  const type = component.type;
  const framework = config.stack.framework;
  const architecture = config.stack.architecture;
  if (component?.algorithms && type !== "schema") {
    return resolveAlgorithmChoice(component, architecture);
  }
  const templateConfig = component.templates?.[framework];
  if (!templateConfig) {
    logger.error(
      `Framework '${framework}' is not supported by '${component.title.toLowerCase()}'.`
    );
    process.exit(1);
  }
  let selectedPath;
  switch (type) {
    case "schema":
      selectedPath = resolveDatabaseTemplate(
        templateConfig,
        config,
        architecture,
        options,
        component.slug
      );
      if (selectedPath) {
        const schemaDeps = resolveDependencies(
          component,
          framework,
          config.database?.type,
          config.database?.orm
        );
        return {
          templatePath: selectedPath,
          additionalRuntimeDeps: schemaDeps.runtime,
          additionalDevDeps: schemaDeps.dev
        };
      }
      break;
    case "blueprint":
      selectedPath = resolveDatabaseTemplate(
        templateConfig,
        config,
        architecture,
        options,
        component.slug
      );
      if (type === "blueprint" && selectedPath) {
        const result = spinner("Installing Dependencies").start();
        const blueprintDeps = resolveDependencies(
          component,
          framework,
          config.database?.type,
          config.database?.orm
        );
        result.succeed();
        return {
          templatePath: selectedPath,
          additionalRuntimeDeps: blueprintDeps.runtime,
          additionalDevDeps: blueprintDeps.dev
        };
      }
      break;
    case "tooling":
      selectedPath = templateConfig[architecture];
      break;
    default:
      selectedPath = typeof templateConfig === "string" ? templateConfig : templateConfig[architecture];
      break;
  }
  if (!selectedPath) {
    logger.error(
      `Architecture '${architecture}' is not supported for ${type} '${component.slug}'.`
    );
    process.exit(1);
  }
  return {
    templatePath: selectedPath,
    additionalRuntimeDeps: [],
    additionalDevDeps: []
  };
}
function resolveDatabaseTemplate(templateConfig, config, architecture, options, slug) {
  const dbType = config.database?.type;
  const orm = config.database?.orm;
  if (!dbType || !orm) {
    logger.error(
      "Database or ORM not configured. Please run 'servercn init' first."
    );
    process.exit(1);
  }
  const dbConfig = templateConfig[dbType];
  if (!dbConfig || !dbConfig[orm]) {
    logger.error(
      `Database stack "${dbType}-${orm}" is not supported by "${slug}".`
    );
    process.exit(1);
  }
  const archOptions = dbConfig[orm];
  const selectedConfig = archOptions[architecture] ?? archOptions.base;
  if (!selectedConfig) return void 0;
  const variant = options.variant || "advanced";
  return typeof selectedConfig === "string" ? selectedConfig : selectedConfig[variant];
}
async function resolveAlgorithmChoice(component, architecture) {
  const choices = Object.entries(component.algorithms).map(
    ([key, value]) => ({
      title: value.title,
      value: key
    })
  );
  const { algorithm } = await prompts({
    type: "select",
    name: "algorithm",
    message: "Select implementation algorithm:",
    choices
  });
  if (!algorithm) {
    logger.warn("Operation cancelled.");
    process.exit(0);
  }
  const algoConfig = component.algorithms[algorithm];
  const selectedTemplate = algoConfig.templates?.[architecture] ?? algoConfig.templates?.base;
  if (!selectedTemplate) {
    logger.error(
      `Architecture "${architecture}" is not supported for algorithm "${algorithm}".`
    );
    process.exit(1);
  }
  return {
    templatePath: selectedTemplate,
    additionalRuntimeDeps: algoConfig.dependencies?.runtime ?? [],
    additionalDevDeps: algoConfig.dependencies?.dev ?? []
  };
}
async function runPostInstallHooks(componentName, type, component) {
  if (type === "tooling" && componentName === "husky") {
    try {
      await execa2("npx", ["husky", "init"], { stdio: "inherit" });
    } catch (error) {
      logger.warn(
        "Could not initialize husky automatically. Please run 'npx husky init' manually."
      );
    }
  }
  if (component.env?.length) {
    updateEnvExample(component.env, process.cwd());
  }
}
function resolveDependencies(component, framework, db, orm) {
  const sets = component.dependencies;
  const relevantKeys = [
    "common",
    `stack:${framework}`,
    `db:${db}`,
    `orm:${orm}`
  ];
  return relevantKeys.reduce(
    (acc, key) => {
      const set = sets[key];
      if (set) {
        acc.runtime.push(...set.runtime || []);
        acc.dev.push(...set.dev || []);
      }
      return acc;
    },
    { runtime: [], dev: [] }
  );
}

// src/commands/init.ts
import fs9 from "fs-extra";
import path12 from "path";
import prompts2 from "prompts";
import { execa as execa3 } from "execa";
async function init(foundation) {
  const cwd = process.cwd();
  const configPath = path12.join(cwd, SERVERCN_CONFIG_FILE);
  if (await fs9.pathExists(configPath) && !foundation) {
    logger.warn(`${APP_NAME} is already initialized in this project.`);
    logger.info("You can now add components: npx servercn add <component-name>");
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
      rootDir: "src",
      sourceMap: true,
      alwaysStrict: true,
      useUnknownInCatchVariables: true,
      forceConsistentCasingInFileNames: true,
      baseUrl: ".",
      paths: {
        "@/*": ["./*"]
      }
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
          { title: "mvc (controllers, services, models)", value: "mvc" },
          { title: "feature (modules, shared)", value: "feature" }
        ]
      },
      {
        type: "confirm",
        name: "initGit",
        message: "Initialize git repository?",
        initial: true
      }
    ]);
    const rootPath2 = path12.resolve(cwd, response2.root);
    await fs9.ensureDir(rootPath2);
    if (!fs9.pathExistsSync(rootPath2)) {
      logger.error(`Failed to create project directory: ${rootPath2}`);
      process.exit(1);
    }
    if (response2.initGit) {
      try {
        await execa3("git", ["init"], { cwd: rootPath2 });
        logger.info("Initialized git repository.");
      } catch (error) {
        logger.warn("Failed to initialize git repository. is git installed?");
      }
    }
    logger.info(`initializing with foundation: ${foundation}`);
    try {
      const component = await getRegistryComponent(
        foundation,
        "foundation"
      );
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
      await fs9.writeJson(path12.join(rootPath2, SERVERCN_CONFIG_FILE), config2, {
        spaces: 2
      });
      await fs9.writeJson(path12.join(rootPath2, ".prettierrc"), prettierConfig, {
        spaces: 2
      });
      await fs9.writeFile(
        path12.join(rootPath2, ".prettierignore"),
        `build
dist
.env
node_modules`
      );
      await fs9.writeFile(
        path12.join(rootPath2, ".gitignore"),
        `build
dist
.env
node_modules`
      );
      await fs9.writeJson(path12.join(rootPath2, "tsconfig.json"), tsConfig, {
        spaces: 2
      });
      await fs9.writeFile(
        path12.join(rootPath2, "commitlint.config.ts"),
        `export default ${JSON.stringify(commitlintConfig, null, 2)}`
      );
      const templatePathRelative = component.templates.express[response2.architecture];
      if (!templatePathRelative) {
        throw new Error(
          `Template not found for ${foundation.toLowerCase()} (express/${response2.architecture})`
        );
      }
      const templateDir = path12.resolve(paths.templates(), templatePathRelative);
      await copyTemplate({
        templateDir,
        targetDir: rootPath2,
        componentName: foundation,
        conflict: "overwrite"
      });
      await installDependencies({
        runtime: component.dependencies.runtime,
        dev: component.dependencies.dev,
        cwd: rootPath2
      });
      logger.success(`${APP_NAME} initialized with ${foundation}.`);
      logger.info("Configure environment variables in .env file.");
      logger.log("Run the following commands:");
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
          title: "typescript (recommended)",
          value: "typescript"
        }
      ]
    },
    {
      type: "select",
      name: "framework",
      message: "Backend framework",
      choices: [{ title: "express", value: "express" }]
    },
    {
      type: "select",
      name: "databaseType",
      message: "Select database",
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
      message: "Mongodb library",
      choices: [{ title: "mongoose", value: "mongoose" }]
    },
    {
      type: (_prev, values) => ["postgresql", "mysql"].includes(values.databaseType) ? "select" : null,
      name: "orm",
      message: "Orm / query builder",
      choices: [
        { title: "drizzle", value: "drizzle" }
        // { title: "prisma", value: "prisma" }
      ]
    }
  ]);
  if (!response.architecture) {
    logger.warn("Initialization cancelled.");
    return;
  }
  const rootPath = path12.resolve(cwd, response.root);
  const srcPath = path12.resolve(rootPath, response.srcDir);
  await fs9.ensureDir(rootPath);
  await fs9.ensureDir(srcPath);
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
      createdBy: `servercn@${LATEST_VERSION}`
    }
  };
  await fs9.writeJson(path12.join(rootPath, SERVERCN_CONFIG_FILE), config, {
    spaces: 2
  });
  logger.success(`
${APP_NAME} initialized successfully.`);
  logger.log("You may now add components by running:");
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
      items = components.slice(1).map((item) => {
        if (item === "auth") return "auth/index";
        return item;
      });
    } else if (components[0] === "blueprint") {
      type = "blueprint";
      items = components.slice(1);
    } else if (components[0] === "tooling") {
      type = "tooling";
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