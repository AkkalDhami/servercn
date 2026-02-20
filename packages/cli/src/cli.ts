#!/usr/bin/env node

import { Command } from "commander";
import { add } from "@/commands/add";
import { init } from "@/commands/init";
import type { Architecture, RegistryType } from "@/types";
import { LATEST_VERSION } from "@/constants/app.constants";
import { registryListCommands } from "./commands/list";

const program = new Command();

process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));

async function main() {
  program
    .name("servercn")
    .description("Scaffold and manage backend components for Node.js projects")
    .version(LATEST_VERSION, "-v, --version", "output the current version");

  program
    .command("init [foundation]")
    .description("Initialize ServerCN in the current project")
    .option("-f, --force", "Overwrite existing files if they exist")
    .action(init);

  registryListCommands(program);

  program
    .command("add <components...>")
    .description("Add one or more backend components to your project")
    .option("--arch <arch>", "Project architecture: mvc or feature", "mvc")
    .option(
      "--variant <variant>",
      "Component variant: advanced or minimal",
      "advanced"
    )
    .option("-f, --force", "Force overwrite existing files")
    .action(
      async (
        components: string[],
        options: {
          arch: Architecture;
          variant: "minimal" | "advanced";
          force: boolean;
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
        }

        for (const item of items) {
          await add(item, {
            arch: options.arch,
            variant: options.variant,
            type: type,
            force: options.force
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
