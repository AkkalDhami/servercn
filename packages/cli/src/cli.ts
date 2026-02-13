#!/usr/bin/env node

import { Command } from "commander";
import { add } from "@/src/commands/add";
import { init } from "@/src/commands/init";
import { list } from "@/src/commands/list";
import type { RegistryType } from "./types";
import { LATEST_VERSION } from "./constants/app-constants";

const program = new Command();

process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));

async function main() {
  program
    .name("servercn")
    .description("Backend components for Node.js")
    .version(LATEST_VERSION, "-v, --version", "display the version number");

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
    .action(async (components: string[], options) => {
      let type: RegistryType = "component";
      let items = components;

      if (components[0] === "schema") {
        type = "schema";
        items = components.slice(1).map(item => {
          if (item === "auth") return "auth/index";
          return item;
        });
      } else if (components[0] === "blueprint") {
        type = "blueprint";
        items = components.slice(1);
      } else if (components[0] === "tooling") {
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
    });

  program.parse(process.argv);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
