import fs from "fs-extra";
import path from "path";
import prompts from "prompts";
import { execa } from "execa";
import { logger } from "@/utils/logger";
import { APP_NAME, SERVERCN_CONFIG_FILE } from "@/constants/app.constants";
import { getRegistry } from "@/lib/registry";
import { cloneServercnRegistry, copyTemplate } from "@/lib/copy";
import { installDependencies } from "@/lib/install-deps";
import type {
  AddOptions,
  Architecture,
  FrameworkType,
  RegistryFoundation
} from "@/types";
import { tsConfig } from "@/configs/ts.config";
import { commitlintConfig } from "@/configs/commitlint.config";
import { prettierConfig, prettierIgnore } from "@/configs/prettier.config";
import { servercnConfig } from "@/configs/servercn.config";
import { gitignore } from "@/configs/gitignore.config";
import { getDatabaseConfig, getFrameworkConfig } from "@/lib/config";
import { updateEnvKeys } from "@/utils/update-env";
import { detectPackageManager } from "@/lib/detect";
import { paths } from "@/lib/paths";
import { eslintConfig } from "@/configs/eslint.config";
import { getToolingChoices, getToolingDepsFromChoices } from "@/utils/tooling";

export async function init(foundation?: string, options: AddOptions = {}) {
  const cwd = process.cwd();
  const configPath = path.join(cwd, SERVERCN_CONFIG_FILE);

  const FOUNDATION_ARCH_MAP = {
    "express-starter": ["mvc", "feature"],
    "mongoose-starter": ["mvc", "feature"],
    "prisma-mongodb-starter": ["mvc", "feature"],
    "drizzle-mysql-starter": ["mvc", "feature"],
    "drizzle-pg-starter": ["mvc", "feature"],
    "nextjs-starter": ["file-api"]
  } as const;

  const ARCH_LABELS = {
    mvc: "MVC (controllers, services, models)",
    feature: "Feature (modules, shared)",
    modular: "Modular Architecture (NestJS)",
    "file-api": "File Based API (NextJS)"
  };

  if (!foundation) {
    const fd = await prompts({
      type: "select",
      name: "foundation",
      message: "Select a project foundation: ",
      choices: [
        {
          title: "Express Starter",
          description: "Minimal Express server setup",
          value: "express-starter"
        },
        {
          title: "Express + Mongoose",
          description: "MongoDB with Mongoose ODM",
          value: "mongoose-starter"
        },
        {
          title: "Express + MongoDB (Prisma)",
          description: "MongoDB database with Prisma ORM",
          value: "prisma-mongodb-starter"
        },
        {
          title: "Express + MySQL (Drizzle)",
          description: "MySQL database with Drizzle ORM",
          value: "drizzle-mysql-starter"
        },
        {
          title: "Express + PostgreSQL (Drizzle)",
          description: "PostgreSQL database with Drizzle ORM",
          value: "drizzle-pg-starter"
        },
        {
          title: "Nextjs Starter",
          description: "Nextjs server setup",
          value: "nextjs-starter"
        },
        {
          title: "Existing Project",
          description: `Generate ${SERVERCN_CONFIG_FILE} for an existing project`,
          value: null
        }
      ]
    });
    foundation = fd.foundation;
  }

  if (await fs.pathExists(configPath)) {
    logger.break();
    logger.break();
    logger.warn(`${APP_NAME} is already initialized in this project.`);
    logger.info(
      "You can now add components: npx servercn-cli add <component-name>"
    );
    logger.break();
    process.exit(1);
  }

  if (foundation) {
    let rootPath = "";
    try {
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
          type: () => {
            if (!foundation) return null;

            const archs =
              FOUNDATION_ARCH_MAP[
                foundation as keyof typeof FOUNDATION_ARCH_MAP
              ];
            return archs.length === 1 ? null : "select";
          },
          name: "architecture",
          message: "Select architecture",
          initial: 0,
          choices: () => {
            const archs =
              FOUNDATION_ARCH_MAP[
                foundation as keyof typeof FOUNDATION_ARCH_MAP
              ] || [];

            return archs.map(a => ({
              title: ARCH_LABELS[a as Architecture],
              value: a
            }));
          },
          format: val => {
            // auto-assign if skipped
            if (!val) {
              return FOUNDATION_ARCH_MAP[
                foundation as keyof typeof FOUNDATION_ARCH_MAP
              ][0];
            }
            return val;
          }
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

      if (!response.architecture && foundation) {
        const archs =
          FOUNDATION_ARCH_MAP[foundation as keyof typeof FOUNDATION_ARCH_MAP];

        if (archs?.length === 1) {
          response.architecture = archs[0];
        }
      }
      logger.break();

      let devDeps: string[] = [];
      const isNextProject =
        ["nextjs-starter"].includes(foundation) ||
        ["nextjs", "next"].includes(options.fw || "");

      if (!isNextProject) {
        const toolingChoices = await getToolingChoices();
        devDeps = getToolingDepsFromChoices(toolingChoices);
      }

      rootPath = path.resolve(cwd, response.root);

      if (response.root !== "." && fs.pathExistsSync(rootPath)) {
        logger.break();
        logger.error(
          `Cannot create '${response.root}' — directory already exists.`
        );
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

      try {
        const component: RegistryFoundation = await getRegistry(
          foundation,
          "foundation",
          options.local
        );

        const baseConfig =
          component.runtimes["node"].frameworks[
            getFramework(options.fw ?? getFrameworkConfig(foundation))
          ];

        if (options.local) {
          const targetDir = paths.targets(response.root ?? ".");
          const localTemplatePath =
            `node/${getFramework(options.fw || getFrameworkConfig(foundation))}/foundation/${baseConfig?.templates[response.architecture as Architecture]}` ||
            "";

          const templateDir = path.resolve(
            paths.templates(),
            localTemplatePath
          );

          if (!(await fs.pathExists(templateDir))) {
            logger.error(
              `\nTemplate not found: ${templateDir}\nCheck your servercn configuration.\n`
            );
            fs.removeSync(rootPath);
            process.exit(1);
          }
          logger.break();

          await copyTemplate({
            templateDir,
            targetDir,
            registryItemName: foundation,
            conflict: options.force ? "overwrite" : "skip"
          });
        } else {
          const templatePath = `node/${getFramework(options.fw || getFrameworkConfig(foundation))}/${response.architecture}`;
          if (!templatePath) {
            logger.error(
              `Template not found for ${foundation?.toLowerCase()} (${response.architecture})`
            );
            fs.removeSync(rootPath);
            return;
          }

          const ok = await cloneServercnRegistry({
            templatePath,
            targetDir: response.root,
            component,
            options
          });

          if (!ok) {
            logger.error(`Failed to initialize foundation:${foundation}.\n`);
            fs.removeSync(rootPath);
            return;
          }
        }

        await fs.writeJson(
          path.join(rootPath, SERVERCN_CONFIG_FILE),
          servercnConfig({
            rootDir: response.root,
            packageManager: response.packageManager,
            runtime: "node",
            language: "typescript",
            framework: getFramework(
              options.fw ?? getFrameworkConfig(foundation)
            ),
            architecture: response.architecture,
            database: getDatabaseConfig(foundation)
          }),
          {
            spaces: 2
          }
        );
        if (!["nextjs", "next"].includes(options.fw || "")) {
          await fs.writeJson(
            path.join(rootPath, ".prettierrc"),
            prettierConfig,
            {
              spaces: 2
            }
          );

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

          await fs.writeFile(
            path.join(rootPath, "eslint.config.mjs"),
            eslintConfig
          );
        }

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
          dev: [...devDeps, baseConfig?.dependencies?.dev || []].flat(),
          cwd: rootPath,
          packageManager: response.packageManager
        });
        logger.break();
        logger.success(
          `${APP_NAME} initialized with 'foundation:${foundation}'.`
        );
        logger.break();
        logger.info("Configure environment variables in .env file.");
        logger.break();
        logger.log("Run the following commands:");

        if (response.root === ".") {
          logger.muted(`1. ${response.packageManager || "npm"} run dev\n`);
        } else {
          logger.muted(`1. cd ${response.root}`);
          logger.muted(`2. ${response.packageManager || "npm"} run dev\n`);
        }
        process.exit(1);
      } catch (e) {
        fs.removeSync(rootPath);
        logger.error(`Failed to initialize foundation: ${e}`);
        process.exit(1);
      }
    } catch {
      logger.error(`\nFailed to initialize foundation\n`);
      fs.removeSync(rootPath);
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
      choices: [
        {
          title: "Express.js",
          value: "express"
        },
        {
          title: "NestJS",
          value: "nestjs"
        },
        {
          title: "NextJS",
          value: "nextjs"
        }
      ],
      initial: 0
    },
    {
      type: (prev, values) => {
        if (!values.framework) return null;
        return "select";
      },
      name: "architecture",
      message: "Select architecture",
      choices: (prev, values) => {
        switch (values.framework) {
          case "express":
            return [
              { title: "MVC (controllers, services, models)", value: "mvc" },
              { title: "Feature-based (modules, shared)", value: "feature" }
            ];

          case "nestjs":
            return [
              { title: "Modular Architecture (NestJS)", value: "modular" }
            ];

          case "nextjs":
            return [{ title: "File Based API (NextJS)", value: "file-api" }];

          default:
            return [];
        }
      }
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
      type: (prev, values) => {
        if (!values.databaseType) return null;
        return "select";
      },
      name: "orm",
      message: "Select ORM / library",
      choices: (prev, values) => {
        if (values.databaseType === "mongodb") {
          return [
            { title: "Mongoose", value: "mongoose" },
            { title: "Prisma", value: "prisma" }
          ];
        }

        if (["postgresql", "mysql"].includes(values.databaseType)) {
          return [
            { title: "Drizzle", value: "drizzle" },
            { title: "Prisma", value: "prisma" }
          ];
        }

        return [];
      }
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
    logger.error(
      `Cannot create '${response.root}' — directory already exists.`
    );
    logger.break();
    process.exit(1);
  }

  await fs.ensureDir(rootPath);

  await fs.writeJson(
    path.join(rootPath, SERVERCN_CONFIG_FILE),
    servercnConfig({
      rootDir: response.root,
      packageManager: response.packageManager,
      runtime: "node",
      language: response.language,
      framework: response.framework,
      architecture: response.architecture,
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

function getFramework(fw: string): FrameworkType {
  switch (fw) {
    case "express":
    case "expressjs":
      return "express";
    case "nestjs":
    case "nest":
      return "nestjs";
    case "nextjs":
    case "next":
      return "nextjs";
    default:
      return "express";
  }
}
