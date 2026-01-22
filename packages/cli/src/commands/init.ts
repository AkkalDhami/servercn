import fs from "fs-extra";
import path from "path";
import prompts from "prompts";
import { logger } from "../utils/cli-logger";
import { SERVERCN_CONFIG_FILE } from "../constants/app-constants";
import { getRegistryComponent } from "../lib/registry";
import { getTemplatesPath } from "../lib/paths";
import { copyTemplate } from "../lib/copy";
import { installDependencies } from "../lib/install-deps";
import { getDatabaseConfig } from "../lib/config";

export async function init(foundation?: string) {
  const cwd = process.cwd();
  const configPath = path.join(cwd, SERVERCN_CONFIG_FILE);

  if ((await fs.pathExists(configPath)) && !foundation) {
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
    const response = await prompts([
      {
        type: "text",
        name: "root",
        message: "Project root directory",
        initial: ".",
        format: val => val.trim() || "."
      },
      {
        type: "select",
        name: "architecture",
        message: "Select architecture",
        choices: [
          { title: "MVC (controllers, services, models)", value: "mvc" },
          { title: "Feature-based (domain-driven modules)", value: "feature" }
        ]
      }
    ]);

    const rootPath = path.resolve(cwd, response.root);

    await fs.ensureDir(rootPath);

    if (!fs.pathExistsSync(rootPath)) {
      logger.error(`Failed to create project directory: ${rootPath}`);
      process.exit(1);
    }

    logger.info(`Initializing with foundation: ${foundation}`);

    try {
      const component = await getRegistryComponent(foundation, "foundation");

      const config = {
        version: "1.0.0",

        project: {
          root: response.root,
          srcDir: "src",
          type: "backend"
        },

        stack: {
          runtime: "node",
          language: "typescript",
          framework: "express",
          architecture: response.architecture
        },

        database: getDatabaseConfig(foundation),

        overrides: {},

        meta: {
          createdAt: new Date().toISOString(),
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

      await fs.writeJson(path.join(rootPath, SERVERCN_CONFIG_FILE), config, {
        spaces: 2
      });

      await fs.writeJson(path.join(rootPath, ".prettierrc"), prettierConfig, {
        spaces: 2
      });

      await fs.writeFile(
        path.join(rootPath, ".prettierignore"),
        `build\ndist\n.env\nnode_modules`
      );

      await fs.writeJson(path.join(rootPath, "tsconfig.json"), tsConfig, {
        spaces: 2
      });

      await fs.writeFile(
        path.join(rootPath, "commitlint.config.ts"),
        `export default ${JSON.stringify(commitlintConfig, null, 2)}`
      );

      const templatePathRelative =
        component.templates?.express?.[response.architecture];

      if (!templatePathRelative) {
        throw new Error(
          `Template not found for ${foundation} (express/${response.architecture})`
        );
      }

      const templateDir = path.resolve(
        getTemplatesPath(),
        templatePathRelative
      );

      await copyTemplate({
        templateDir,
        targetDir: rootPath,
        componentName: foundation,
        conflict: "overwrite"
      });

      await installDependencies({
        runtime: component.dependencies?.runtime,
        dev: component.dependencies?.dev,
        cwd: rootPath
      });

      logger.success(`\nSuccess! ServerCN initialized with ${foundation}.`);
      logger.info("Configure environment variables in .env file.");
      logger.log("Run the following commands:");

      if (response.root === ".") {
        logger.muted(`1. npm run dev`);
      } else {
        logger.muted(`1. cd ${response.root}`);
        logger.muted(`2. npm run dev`);
      }

      return;
    } catch (error) {
      logger.error(`Failed to initialize foundation: ${error}`);
      process.exit(1);
    }
  }

  const response = await prompts([
    {
      type: "text",
      name: "root",
      message: "Project root directory",
      initial: ".",
      format: val => val.trim() || "."
    },
    {
      type: "text",
      name: "srcDir",
      message: "Source directory",
      initial: "src",
      format: val => val.trim() || "src"
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
      type: prev => (prev === "mongodb" ? "select" : null),
      name: "orm",
      message: "MongoDB library",
      choices: [{ title: "Mongoose", value: "mongoose" }]
    },
    {
      type: (_prev, values) =>
        ["postgresql", "mysql"].includes(values.databaseType) ? "select" : null,
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

  const rootPath = path.resolve(cwd, response.root);
  const srcPath = path.resolve(rootPath, response.srcDir);

  await fs.ensureDir(rootPath);
  await fs.ensureDir(srcPath);

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

    database:
      response.databaseType === "none"
        ? null
        : {
            type: response.databaseType,
            orm: response.orm
          },

    overrides: {},

    meta: {
      createdAt: new Date().toISOString(),
      createdBy: "servercn@1.0.0"
    }
  };

  await fs.writeJson(path.join(rootPath, SERVERCN_CONFIG_FILE), config, {
    spaces: 2
  });

  await fs.writeJson(path.join(rootPath, "tsconfig.json"), tsConfig, {
    spaces: 2
  });

  logger.success("\nSuccess! ServerCN initialized successfully.");

  logger.log("You may now add components by running:");
  logger.muted(`1. cd ${response.root}`);
  logger.muted("2. npx servercn add <component>");
  logger.muted("Ex: npx servercn add jwt-utils file-upload");
}
