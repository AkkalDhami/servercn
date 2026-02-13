import fs from "fs-extra";
import path from "path";
import prompts from "prompts";
import { execa } from "execa";
import { logger } from "../utils/logger";
import {
  APP_NAME,
  LATEST_VERSION,
  SERVERCN_CONFIG_FILE
} from "../constants/app-constants";
import { getRegistryComponent } from "../lib/registry";
import { copyTemplate } from "../lib/copy";
import { installDependencies } from "../lib/install-deps";
import { getDatabaseConfig } from "../lib/config";
import { paths } from "../lib/paths";
import type { IFoundation, IServerCNConfig } from "../types";

export async function init(foundation?: string) {
  const cwd = process.cwd();
  const configPath = path.join(cwd, SERVERCN_CONFIG_FILE);

  if ((await fs.pathExists(configPath)) && !foundation) {
    logger.warn(`${APP_NAME} is already initialized in this project.`);
    logger.info(
      "You can now add components: npx servercn add <component-name>"
    );
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
      paths: {
        "@/*": ["./*"]
      }
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

    const rootPath = path.resolve(cwd, response.root);

    await fs.ensureDir(rootPath);

    if (!fs.pathExistsSync(rootPath)) {
      logger.error(`Failed to create project directory: ${rootPath}`);
      process.exit(1);
    }

    if (response.initGit) {
      try {
        await execa("git", ["init"], { cwd: rootPath });
        logger.info("Initialized git repository.");
      } catch (error) {
        logger.warn("Failed to initialize git repository. is git installed?");
      }
    }

    logger.info(`initializing with foundation: ${foundation}`);

    try {
      const component: IFoundation = await getRegistryComponent(
        foundation,
        "foundation"
      );

      const config: IServerCNConfig = {
        version: LATEST_VERSION,

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
          createdBy: `servercn@${LATEST_VERSION}`
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
      await fs.writeFile(
        path.join(rootPath, ".gitignore"),
        `build\ndist\n.env\nnode_modules`
      );

      await fs.writeJson(path.join(rootPath, "tsconfig.json"), tsConfig, {
        spaces: 2
      });

      await fs.writeFile(
        path.join(rootPath, "commitlint.config.ts"),
        `export default ${JSON.stringify(commitlintConfig, null, 2)}`
      );

      const templatePathRelative: string =
        component.templates.express[response.architecture as "mvc" | "feature"];

      if (!templatePathRelative) {
        logger.error(
          `Template not found for ${foundation.toLowerCase()} (express/${response.architecture})`
        );
      }

      const templateDir = path.resolve(paths.templates(), templatePathRelative);

      await copyTemplate({
        templateDir,
        targetDir: rootPath,
        componentName: foundation,
        conflict: "overwrite"
      });

      await installDependencies({
        runtime: component.dependencies.runtime,
        dev: component.dependencies.dev,
        cwd: rootPath
      });

      logger.success(`${APP_NAME} initialized with ${foundation}.`);
      logger.info("Configure environment variables in .env file.");
      logger.log("Run the following commands:");

      if (response.root === ".") {
        logger.muted(`1. npm run dev\n`);
      } else {
        logger.muted(`1. cd ${response.root}`);
        logger.muted(`2. npm run dev\n`);
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
      type: prev => (prev === "mongodb" ? "select" : null),
      name: "orm",
      message: "Mongodb library",
      choices: [{ title: "mongoose", value: "mongoose" }]
    },
    {
      type: (_prev, values) =>
        ["postgresql", "mysql"].includes(values.databaseType) ? "select" : null,
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

  const rootPath = path.resolve(cwd, response.root);
  const srcPath = path.resolve(rootPath, response.srcDir);

  await fs.ensureDir(rootPath);
  await fs.ensureDir(srcPath);

  const config = {
    version: LATEST_VERSION,

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
      createdBy: `servercn@${LATEST_VERSION}`
    }
  };

  await fs.writeJson(path.join(rootPath, SERVERCN_CONFIG_FILE), config, {
    spaces: 2
  });

  logger.success(`\n${APP_NAME} initialized successfully.`);

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
