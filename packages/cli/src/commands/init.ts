/* eslint-disable @typescript-eslint/no-unused-vars */
import fs from "fs-extra";
import path from "path";
import prompts from "prompts";
import { execa } from "execa";
import { logger } from "@/utils/logger";
import { APP_NAME, SERVERCN_CONFIG_FILE } from "@/constants/app.constants";
import { getRegistry } from "@/lib/registry";
import { copyTemplate } from "@/lib/copy";
import { installDependencies } from "@/lib/install-deps";
import type { AddOptions, RegistryFoundation } from "@/types";
import { tsConfig } from "@/configs/ts.config";
import { commitlintConfig } from "@/configs/commitlint.config";
import { prettierConfig, prettierIgnore } from "@/configs/prettier.config";
import { servercnConfig } from "@/configs/servercn.config";
import { gitignore } from "@/configs/gitignore.config";
import { getDatabaseConfig } from "@/lib/config";
import { paths } from "@/lib/paths";
import { updateEnvKeys } from "@/utils/update-env";
import { detectPackageManager } from "@/lib/detect";

export async function init(foundation?: string, options: AddOptions = {}) {
  const cwd = process.cwd();
  const configPath = path.join(cwd, SERVERCN_CONFIG_FILE);

  if ((await fs.pathExists(configPath)) && !foundation) {
    logger.warn(`${APP_NAME} is already initialized in this project.`);
    logger.info(
      "You can now add components: npx servercn-cli add <component-name>"
    );
    process.exit(1);
  }

  if (foundation) {
    logger.break();
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
          { title: "Feature (modules, shared)", value: "feature" }
        ]
      },
      {
        type: "select",
        name: "packageManager",
        message: "Select package manager",
        choices: [
          { title: "npm", value: "npm" },
          { title: "pnpm", value: "pnpm" },
          { title: "yarn", value: "yarn" },
          { title: "bun", value: "bun" }
        ],
        initial: Math.max(
          0,
          ["npm", "pnpm", "yarn", "bun"].indexOf(detectPackageManager())
        )
      },
      {
        type: "confirm",
        name: "initGit",
        message: "Initialize git repository?",
        initial: false
      }
    ]);

    const rootPath = path.resolve(cwd, response.root);

    if (response.root !== "." && fs.pathExistsSync(rootPath)) {
      logger.break();
      logger.error(`Cannot create '${response.root}' — file already exists!`);
      logger.break();
      process.exit(1);
    }
    await fs.ensureDir(rootPath);

    if (!fs.pathExistsSync(rootPath)) {
      logger.error(`Failed to create project directory: ${rootPath}`);
      process.exit(1);
    }

    if (response.initGit) {
      try {
        await execa("git", ["init"], { cwd: rootPath });
        logger.info("Initialized git repository.");
      } catch {
        logger.warn("Failed to initialize git repository. is git installed?");
      }
    }

    logger.info();
    try {
      // ora(
      //   `Initializing project with foundation: ${foundation}`
      // ).start();
      const component: RegistryFoundation = await getRegistry(
        foundation,
        "foundation"
      );

      const baseConfig = component.runtimes["node"].frameworks["express"];

      await fs.writeJson(
        path.join(rootPath, SERVERCN_CONFIG_FILE),
        servercnConfig({
          project: {
            root: response.root,
            type: "backend",
            packageManager: response.packageManager
          },
          stack: {
            runtime: "node",
            language: "typescript",
            framework: "express",
            architecture: response.architecture
          },
          database: getDatabaseConfig(foundation)
        }),
        {
          spaces: 2
        }
      );

      const templatePathRelative =
        baseConfig?.templates[response.architecture as "mvc" | "feature"];

      if (!templatePathRelative) {
        logger.error(
          `Template not found for ${foundation.toLowerCase()} (${response.architecture})`
        );
        return;
      }

      const templateDir = path.resolve(
        `${paths.templates()}/node/express/foundation/`,
        templatePathRelative
      );

      console.log({
        templateDir,
        templatePathRelative
      });

      await copyTemplate({
        templateDir,
        targetDir: rootPath,
        registryItemName: foundation,
        conflict: "overwrite"
      });

      await fs.writeJson(path.join(rootPath, ".prettierrc"), prettierConfig, {
        spaces: 2
      });

      await fs.writeFile(
        path.join(rootPath, ".prettierignore"),
        prettierIgnore
      );

      await fs.writeFile(path.join(rootPath, ".gitignore"), gitignore);

      await fs.writeJson(path.join(rootPath, "tsconfig.json"), tsConfig, {
        spaces: 2
      });

      await fs.writeFile(
        path.join(rootPath, "commitlint.config.ts"),
        `export default ${JSON.stringify(commitlintConfig, null, 2)}`
      );
      const filterEnvs =
        baseConfig?.env?.filter((env: string) => env !== "") || [];

      if (filterEnvs?.length > 0) {
        updateEnvKeys({
          envFile: ".env.example",
          envKeys: filterEnvs,
          label: foundation,
          cwd: rootPath
        });
        updateEnvKeys({
          envFile: ".env",
          envKeys: filterEnvs,
          label: foundation,
          cwd: rootPath
        });
      }

      await installDependencies({
        runtime: baseConfig?.dependencies?.runtime || [],
        dev: baseConfig?.dependencies?.dev || [],
        cwd: rootPath,
        packageManager: response.packageManager
      });
      logger.break();
      logger.success(`${APP_NAME} initialized with ${foundation}.`);
      logger.break();
      logger.info("Configure environment variables in .env file.");
      logger.break();
      logger.log("Run the following commands:");

      if (response.root === ".") {
        logger.muted(`1. npm run dev\n`);
      } else {
        logger.muted(`1. cd ${response.root}`);
        logger.muted(`2. npm run dev\n`);
      }
      process.exit(1);
    } catch (e) {
      fs.removeSync(rootPath);
      logger.error(`Failed to initialize foundation: ${e}`);
      process.exit(1);
    }
  }

  logger.break();

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
        { title: "Feature-based (modules, shared)", value: "feature" }
      ]
    },
    {
      type: "select",
      name: "language",
      message: "Programming language",
      choices: [
        {
          title: "Typescript (recommended)",
          value: "typescript"
        }
      ]
    },
    {
      type: "select",
      name: "framework",
      message: "Backend framework",
      choices: [{ title: "Express.js", value: "express" }]
    },
    {
      type: "select",
      name: "databaseType",
      message: "Select database",
      choices: [
        {
          title: "Mongodb",
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
      message: "Mongodb library",
      choices: [{ title: "mongoose", value: "mongoose" }]
    },
    {
      type: (_prev, values) =>
        ["postgresql", "mysql"].includes(values.databaseType) ? "select" : null,
      name: "orm",
      message: "Orm / query builder",
      choices: [
        { title: "Drizzle", value: "drizzle" }
        // { title: "prisma", value: "prisma" }
      ]
    },
    {
      type: "select",
      name: "packageManager",
      message: "Select package manager",
      choices: [
        { title: "npm", value: "npm" },
        { title: "pnpm", value: "pnpm" },
        { title: "yarn", value: "yarn" },
        { title: "bun", value: "bun" }
      ],
      initial: Math.max(
        0,
        ["npm", "pnpm", "yarn", "bun"].indexOf(detectPackageManager())
      )
    }
  ]);

  if (
    !response.architecture ||
    !response.databaseType ||
    !response.framework ||
    !response.language ||
    !response.orm ||
    !response.root ||
    !response.packageManager
  ) {
    logger.break();
    logger.warn("Initialization cancelled.");
    logger.break();
    return;
  }

  const rootPath = path.resolve(cwd, response.root);

  if (response.root !== "." && fs.pathExistsSync(rootPath)) {
    logger.break();
    logger.error(`Cannot create '${response.root}' — file already exists!`);
    logger.break();
    process.exit(1);
  }

  await fs.ensureDir(rootPath);

  await fs.writeJson(
    path.join(rootPath, SERVERCN_CONFIG_FILE),
    servercnConfig({
      project: {
        root: response.root,
        type: "backend",
        packageManager: response.packageManager
      },
      stack: {
        runtime: "node",
        language: response.language,
        framework: response.framework,
        architecture: response.architecture
      },
      database: {
        engine: response.databaseType,
        adapter: response.orm
      }
    }),
    {
      spaces: 2
    }
  );

  logger.success(`\n${APP_NAME} initialized successfully.`);
  logger.break();

  logger.log("You may now add components by running:");
  if (response.root === ".") {
    logger.muted("1. npx servercn-cli add <component>");
  } else {
    logger.muted(`1. cd ${response.root}`);
    logger.muted("2. npx servercn-cli add <component>");
  }
  logger.muted(
    "ex: npx servercn-cli add jwt-utils error-handler http-status-codes"
  );
  logger.break();
}
