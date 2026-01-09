import fs from "fs-extra";
import path from "path";
import prompts from "prompts";
import { logger } from "../utils/cli-logger";

const CONFIG_FILE = "servercn.json";

export async function init() {
  const cwd = process.cwd();
  const configPath = path.join(cwd, CONFIG_FILE);

  if (await fs.pathExists(configPath)) {
    logger.warn("ServerCN is already initialized in this project.");
    logger.info("You can now run: servercn add <component>");
    process.exit(1);
  }

  const response = await prompts([
    {
      type: "text",
      name: "root",
      message: "Project root directory",
      initial: ".",
      format: (val) => val.trim() || ".",
    },
    {
      type: "text",
      name: "srcDir",
      message: "Source directory",
      initial: "src",
      format: (val) => val.trim() || "src",
    },
    {
      type: "select",
      name: "architecture",
      message: "Select architecture",
      choices: [
        { title: "MVC (controllers, services, models)", value: "mvc" },
        { title: "Feature-based (domain-driven modules)", value: "feature" },
      ],
    },
    {
      type: "select",
      name: "language",
      message: "Programming language",
      choices: [
        {
          title: "TypeScript (recommended)",
          value: "typescript",
        },
      ],
    },
    {
      type: "select",
      name: "framework",
      message: "Backend framework",
      choices: [{ title: "Express", value: "express" }],
    },
    {
      type: "select",
      name: "databaseType",
      message: "Select database",
      choices: [{ title: "MongoDB", value: "mongodb" }],
    },
    {
      type: (prev) => (prev === "mongodb" ? "select" : null),
      name: "orm",
      message: "MongoDB library",
      choices: [{ title: "Mongoose", value: "mongoose" }],
    },
    {
      type: (_prev, values) =>
        ["postgresql", "mysql", "sqlite"].includes(values.databaseType)
          ? "select"
          : null,
      name: "orm",
      message: "ORM / Query builder",
      choices: [
        { title: "Prisma", value: "prisma" },
        { title: "Drizzle", value: "drizzle" },
        { title: "Sequelize", value: "sequelize" },
        { title: "Knex", value: "knex" },
      ],
    },
    {
      type: "select",
      name: "packageManager",
      message: "Package manager",
      choices: [
        { title: "npm", value: "npm" },
        { title: "pnpm", value: "pnpm" },
        { title: "yarn", value: "yarn" },
      ],
      initial: 0,
    },
  ]);

  if (!response.architecture) {
    logger.warn("Initialization cancelled.");
    return;
  }

  const rootPath = path.resolve(cwd, response.root);
  const srcPath = path.resolve(rootPath, response.srcDir);

  await fs.ensureDir(rootPath);
  await fs.ensureDir(srcPath);

  const config = {
    $schema: "https://servercn.dev/schema/v1.json",
    version: "1.0.0",

    project: {
      root: response.root,
      srcDir: response.srcDir,
      type: "backend",
      packageManager: response.packageManager,
    },

    stack: {
      runtime: "node",
      language: response.language,
      framework: response.framework,
      architecture: response.architecture,
    },

    database:
      response.databaseType === "none"
        ? null
        : {
            type: response.databaseType,
            orm: response.orm,
          },

    overrides: {},

    meta: {
      createdAt: new Date().toISOString(),
      createdBy: "servercn@1.0.0",
    },
  };

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
    },
    include: ["src/**/*"],
    exclude: ["node_modules"],
  };

  await fs.writeJson(path.join(rootPath, CONFIG_FILE), config, { spaces: 2 });

  await fs.writeJson(path.join(rootPath, "tsconfig.json"), tsConfig, {
    spaces: 2,
  });

  logger.success("\nSuccess! ServerCN initialized successfully.");

  logger.info("You may now add components by running:");
  logger.info("- servercn add <component>\n");
}
