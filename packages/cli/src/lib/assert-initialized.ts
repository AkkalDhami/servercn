import fs from "fs-extra";
import path from "path";
import { logger } from "@/utils/logger";
import {
  APP_NAME,
  SERVERCN_CONFIG_FILE,
  SERVERCN_URL
} from "@/constants/app.constants";
import { highlighter } from "@/utils/highlighter";
import prompts from "prompts";
import { detectPackageManager } from "./detect";
import { servercnConfig } from "@/configs/servercn.config";

export async function assertInitialized() {
  const configPath = path.resolve(process.cwd(), SERVERCN_CONFIG_FILE);

  if (!(await fs.pathExists(configPath))) {
    try {
      logger.break();
      logger.warn("servercn isn't initialized in this project.");

      const initResponse = await prompts({
        name: "confirm",
        type: "confirm",
        message: "Would you like to initialize it now?"
      });

      if (!initResponse.confirm) {
        logger.break();
        logger.error("Aborted. servercn is not initialized in this project.");
        logger.break();
        process.exit(1);
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
                  {
                    title: "MVC (controllers, services, models)",
                    value: "mvc"
                  },
                  { title: "Feature-based (modules, shared)", value: "feature" }
                ];

              case "nestjs":
                return [
                  { title: "Modular Architecture (NestJS)", value: "modular" }
                ];

              case "nextjs":
                return [
                  { title: "File Based API (NextJS)", value: "file-api" }
                ];

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

      const rootPath = path.resolve(process.cwd(), response.root);

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
    } catch {
      logger.break();
      logger.error(`${APP_NAME} is not initialized in this project.`);
      logger.break();
      logger.log("Run the following command first:");
      logger.log(`> ${highlighter.create("npx servercn-cli init")}`);
      logger.break();
      logger.log(
        `For express starter:\n> ${highlighter.create("npx servercn-cli init express-server")}`
      );
      logger.break();
      logger.log(
        `For (express + mongoose) starter:\n> ${highlighter.create("npx servercn-cli init mongoose-starter")}`
      );
      logger.break();
      logger.log(
        `For (drizzle + mysql) starter:\n> ${highlighter.create("npx servercn-cli init drizzle-mysql-starter")}`
      );
      logger.break();
      logger.log(
        `For (drizzle + postgresql) starter:\n> ${highlighter.create("npx servercn-cli init drizzle-pg-starter")}`
      );
      logger.break();

      logger.info(
        `Visit ${SERVERCN_URL}/docs/installation for more information`
      );
      logger.break();
      process.exit(1);
    }
  }
}
