import type { Command } from "commander";
import {
  listOverview,
  listComponents,
  listFoundations,
  listTooling,
  listSchemas,
  listBlueprints,
  type listOptionType
} from "./list.handlers";

export function registryListCommands(program: Command) {
  const list = program
    .command("list")
    .alias("ls")
    .description("List available ServerCN resources")
    .option("--json", "Output resources as JSON")
    .option("--all", "Display all available registries")
    .enablePositionalOptions()
    .action((options: listOptionType) => {
      listOverview(options);
    });

  function resolveOptions(cmd: Command): listOptionType {
    return cmd.parent?.opts() as listOptionType;
  }

  list
    .command("components")
    .alias("cp")
    .description("List available components")
    .action((_, cmd) => {
      listComponents(resolveOptions(cmd));
    });

  list
    .command("foundations")
    .alias("fd")
    .description("List available foundations")
    .action((_, cmd) => {
      listFoundations(resolveOptions(cmd));
    });

  list
    .command("tooling")
    .alias("tl")
    .description("List available tooling")
    .action((_, cmd) => {
      listTooling(resolveOptions(cmd));
    });

  list
    .command("schemas")
    .alias("sc")
    .description("List available schemas")
    .action((_, cmd) => {
      listSchemas(resolveOptions(cmd));
    });

  list
    .command("blueprints")
    .alias("bp")
    .description("List available blueprints")
    .action((_, cmd) => {
      listBlueprints(resolveOptions(cmd));
    });
}
