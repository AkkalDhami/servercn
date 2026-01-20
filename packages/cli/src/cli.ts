#!/usr/bin/env node

import { Command } from "commander";
import { add } from "./commands/add";
import { init } from "./commands/init";
import { list } from "./commands/list";
import type { RegistryType } from "./types/registry";

const program = new Command();

process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));

async function main() {
  program
    .name("servercn")
    .description("Backend components for Node.js")
    .version("0.0.1");

  program
    .command("init [foundation]")
    .description("Initialize ServerCN in your project")
    .action(init);

  program
    .command("list")
    .description("List available ServerCN components")
    .action(list);

  program
    .command("add <components...>")
    .description("Add a backend component")
    .option("--arch <arch>", "Architecture (mvc | feature)", "mvc")
    .option("--variant <variant>", "Variant (advanced | minimal)", "advanced")
    .option("-f, --force", "Overwrite existing files")
    .action(async (components, options) => {
      let type: RegistryType = "component";
      let items = components;

      if (components[0] === "schema") {
        type = "schema";
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
    });

  program.parse(process.argv);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
