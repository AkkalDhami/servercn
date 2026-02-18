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
    .action((options: listOptionType) => {
      listOverview(options);
    });

  list
    .command("components")
    .alias("cp")
    .description("List available components")
    .option("--json", "Output components as JSON")
    .action((options: listOptionType) => {
      listComponents(options);
    });

  list
    .command("foundations")
    .alias("fd")
    .description("List available foundations")
    .option("--json", "Output foundations as JSON")
    .action((options: listOptionType) => {
      listFoundations(options);
    });

  list
    .command("tooling")
    .alias("tl")
    .description("List available tooling")
    .option("--json", "Output tooling as JSON")
    .action((options: listOptionType) => {
      listTooling(options);
    });

  list
    .command("schemas")
    .alias("sc")
    .description("List available schemas")
    .option("--json", "Output schemas as JSON")
    .action((options: listOptionType) => {
      listSchemas(options);
    });

  list
    .command("blueprints")
    .alias("bp")
    .description("List available blueprints")
    .option("--json", "Output blueprints as JSON")
    .action((options: listOptionType) => {
      listBlueprints(options);
    });
}
