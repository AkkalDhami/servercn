#!/usr/bin/env node

import { Command } from "commander";
import { add } from "./commands/add";
import { init } from "./commands/init";
import { list } from "./commands/list";

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
    .option("-f, --force", "Overwrite existing files")
    .action(async (components, options) => {
      for (const component of components) {
        await add(component, {
          arch: options.arch,
        });
      }
    });

  program.parse(process.argv);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
