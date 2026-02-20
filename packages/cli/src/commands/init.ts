import fs from "fs-extra";
import path from "path";
import prompts from "prompts";
import { execa } from "execa";
import ora from "ora";
import { logger } from "@/utils/logger";
import { APP_NAME, SERVERCN_CONFIG_FILE } from "@/constants/app.constants";
import { getRegistry } from "@/lib/registry";
import { cloneRegistryTemplate } from "@/lib/copy";
import { installDependencies } from "@/lib/install-deps";
import type { AddOptions, RegistryFoundation } from "@/types";
import { tsConfig } from "@/configs/ts.config";
import { commitlintConfig } from "@/configs/commitlint.config";
import { prettierConfig, prettierIgnore } from "@/configs/prettier.config";
import { servercnConfig } from "@/configs/servercn.config";
import { gitignore } from "@/configs/gitignore.config";
import { getDatabaseConfig } from "@/lib/config";

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
        type: "confirm",
        name: "initGit",
        message: "Initialize git repository?",
        initial: false
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
      } catch {
        logger.warn("Failed to initialize git repository. is git installed?");
      }
    }

    logger.info();
    ora(
      `Initializing project with foundation: ${foundation}`
    ).start();
    try {
      const component: RegistryFoundation = await getRegistry(
        foundation,
        "foundation"
      );

      await fs.writeJson(
        path.join(rootPath, SERVERCN_CONFIG_FILE),
        servercnConfig({
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
          database: getDatabaseConfig(foundation)
        }),
        {
          spaces: 2
        }
      );

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

      const templatePathRelative =
        component.runtimes['node'].frameworks['express']?.templates[response.architecture as "mvc" | "feature"];

      if (!templatePathRelative) {
        logger.error(
          `Template not found for ${foundation.toLowerCase()} (${response.architecture})`
        );
        return;
      }

      // const templateDir = path.resolve(paths.templates(), templatePathRelative);

      // await copyTemplate({
      //   templateDir,
      //   targetDir: rootPath,
      //   componentName: foundation,
      //   conflict: "overwrite"
      // });

      await cloneRegistryTemplate({
        targetDir: rootPath,
        templateDir: templatePathRelative,
        force: options.force
      });

      await installDependencies({
        runtime: component.runtimes['node'].frameworks['express']?.dependencies?.runtime || [],
        dev: component.runtimes['node'].frameworks['express']?.dependencies?.dev || [],
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
      fs.removeSync(rootPath);
      logger.error(`Failed to initialize foundation: ${error}`);
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
    }
  ]);

  if (
    !response.architecture ||
    !response.databaseType ||
    !response.framework ||
    !response.language ||
    !response.orm ||
    !response.root
  ) {
    logger.break();
    logger.warn("Initialization cancelled.");
    logger.break();
    return;
  }

  const rootPath = path.resolve(cwd, response.root);
  const srcPath = path.resolve(rootPath, response.srcDir);

  if (response.root !== '.' && fs.pathExistsSync(rootPath)) {
    logger.break();
    logger.error(`Cannot create '${response.root}' — file already exists!`);
    logger.break();
    process.exit(1);
  }

  await fs.ensureDir(rootPath);
  await fs.ensureDir(srcPath);

  await fs.writeJson(
    path.join(rootPath, SERVERCN_CONFIG_FILE),
    servercnConfig({
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
      database: {
        type: response.databaseType,
        orm: response.orm
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
