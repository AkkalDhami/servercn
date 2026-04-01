#!/usr/bin/env node

import { Command } from "commander";
import { add } from "@/commands/add";
import { init } from "@/commands/init";
import type { Architecture, RegistryType } from "@/types";
import { LATEST_VERSION } from "@/constants/app.constants";
import { registryListCommands } from "./commands/list";
import { registryViewCommand } from "./commands/view";
import { build, type buildTypeProps } from "./commands/_build";
import { registryInstallCommand } from "./commands/install";

const program = new Command();

process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));

async function main() {
  program
    .name("servercn-cli")
    .description("Scaffold and manage backend components for Node.js projects")
    .version(LATEST_VERSION, "-v, --version", "output the current version");

  program
    .command("init [foundation]")
    .description("Initialize servercn in the current project")
    .option("-f, --force", "Overwrite existing files if they exist")
    .option("--fw <framework>", "Framework type: express | nextjs | nestjs")
    .option(
      "--local",
      "Add registry items from local environment(development runtime)"
    )
    .action(init);

  registryListCommands(program);
  registryViewCommand(program);
  registryInstallCommand(program);

  program
    .command("build")
    .description("Build the project")
    .option("--name <name>", "App name, website name")
    .option("--url <url>", "App URL, website URL")
    .action(async (options: buildTypeProps) => await build(options));

  program
    .command("add <components...>")
    .description("Add one or more backend components to your project")
    .option("--arch <arch>", "Project architecture: mvc or feature", "mvc")
    .option("-f, --force", "Force overwrite existing files")
    .option(
      "--local",
      "Add registry items from local environment(development runtime)"
    )
    .action(
      async (
        components: string[],
        options: {
          arch: Architecture;
          force: boolean;
          local: boolean;
        }
      ) => {
        let type: RegistryType = "component";
        let items = components;

        if (["schema", "sc"].includes(components[0])) {
          type = "schema";
          items = components.slice(1).map(item => {
            return item;
          });
        } else if (["blueprint", "bp"].includes(components[0])) {
          type = "blueprint";
          items = components.slice(1);
        } else if (["tooling", "tl"].includes(components[0])) {
          type = "tooling";
          items = components.slice(1);
        } else if (["provider", "pr"].includes(components[0])) {
          type = "provider";
          items = components.slice(1);
        } else {
          items = components;
        }

        for (const item of items) {
          await add(item, {
            arch: options.arch,
            type: type,
            force: options.force,
            local: options.local
          });
        }
      }
    );

  program.parse(process.argv);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
