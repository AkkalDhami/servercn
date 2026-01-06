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
        { title: "MVC", value: "mvc" },
        { title: "Feature-based", value: "feature" }
      ],
    },
    {
      type: "select",
      name: "language",
      message: "Language",
      choices: [
        { title: "TypeScript", value: "typescript" }
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
      choices: [
        { title: "MongoDB", value: "mongodb" },
      ],
    },
    {
      type: (prev) => (prev === "mongodb" ? "select" : null),
      name: "orm",
      message: "MongoDB library",
      choices: [
        { title: "Mongoose", value: "mongoose" },
      ],
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
    {
      type: "select",
      name: "fileNaming",
      message: "File naming convention",
      choices: [
        { title: "camelCase", value: "camel-case" },
        { title: "kebab-case", value: "kebab-case" },
        { title: "snake_case", value: "snake-case" },
        { title: "PascalCase", value: "pascal-case" },
      ],
    },
    {
      type: "select",
      name: "functionNaming",
      message: "Function naming convention",
      choices: [
        { title: "camelCase", value: "camel-case" },
        { title: "snake_case", value: "snake-case" },
        { title: "PascalCase", value: "pascal-case" },
      ],
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

    conventions: {
      fileNaming: "kebab-case",
      functionNaming: "camel-case",
      envFile: ".env",
      testDir: "__tests__",
    },

    overrides: {},

    meta: {
      createdAt: new Date().toISOString(),
      createdBy: "servercn@1.0.0",
    },
  };

  await fs.writeJson(path.join(rootPath, CONFIG_FILE), config, { spaces: 2 });

  logger.success("\nSuccess! ServerCN initialized successfully.");
  logger.info(`Root directory: ${response.root}`);
  logger.info(`Source directory: ${response.srcDir}`);

  logger.info("You may now add components by running:");
  logger.info("- servercn add <component>\n");
}
