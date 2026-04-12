import type { Command } from "commander";
import {
  resolveInstallMode,
  type InstallOptions,
  installRegistryItemDeps
} from "./install.handlers";

export function registryInstallCommand(program: Command) {
  program
    .command("install <type> <name>")
    .alias("i")
    .description("Install dependencies for a registry item")

    .option("--all", "Install all dependencies (default)")
    .option("--dev-only", "Install only dev dependencies")
    .option("--deps-only", "Install only runtime dependencies")

    .action(
      (
        type: string,
        name: string,
        options: Pick<InstallOptions, "name" | "type"> & {
          all?: boolean;
          devOnly?: boolean;
          depsOnly?: boolean;
        }
      ) => {
        return installRegistryItemDeps({
          type,
          name,
          mode: resolveInstallMode({
            depsOnly: options.depsOnly,
            devOnly: options.devOnly
          })
        });
      }
    );
}
