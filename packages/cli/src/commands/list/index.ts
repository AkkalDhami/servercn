import type { Command } from "commander";
import {
  listOverview,
  listComponents,
  listFoundations,
  listTooling,
  listSchemas,
  listBlueprints,
  type listOptionType,
  listProviders
} from "./list.handlers";
import { APP_NAME } from "@/constants/app.constants";

export function registryListCommands(program: Command) {
  const list = program
    .command("list")
    .alias("ls")
    .description(`List available ${APP_NAME} resources`)
    .option("--json", "Output resources as JSON")
    .option("--all", "Display all available registries")
    .option("--local", "Display only local registries")
    .enablePositionalOptions()
    .action((options: listOptionType) => {
      listOverview(options);
    });

  function resolveOptions(cmd: Command): listOptionType {
    return cmd.parent?.opts() as listOptionType;
  }

  list
    .command("component")
    .alias("cp")
    .description("List available components")
    .action((_, cmd) => {
      listComponents(resolveOptions(cmd));
    });

  list
    .command("foundation")
    .alias("fd")
    .description("List available foundations")
    .action((_, cmd) => {
      listFoundations(resolveOptions(cmd));
    });

  list
    .command("provider")
    .alias("pr")
    .description("List available providers")
    .action((_, cmd) => {
      listProviders(resolveOptions(cmd));
    });

  list
    .command("tooling")
    .alias("tl")
    .description("List available tooling")
    .action((_, cmd) => {
      listTooling(resolveOptions(cmd));
    });

  list
    .command("schema")
    .alias("sc")
    .description("List available schemas")
    .action((_, cmd) => {
      listSchemas(resolveOptions(cmd));
    });

  list
    .command("blueprint")
    .alias("bp")
    .description("List available blueprints")
    .action((_, cmd) => {
      listBlueprints(resolveOptions(cmd));
    });
}
