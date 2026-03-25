import type { Command } from "commander";
import { viewRegistryItem } from "./view.handler";

export function registryViewCommand(program: Command) {
  program
    .command("view <type> <name>")
    .description("View registry item details")
    .option("--json", "Output as JSON")
    .option("--local", "Use local registry data")
    .option("--fw <framework>", "Framework: express | nestjs | nextjs")
    .option("--arch <arch>", "Architecture: mvc | feature | modular | file-api")
    .option("--db <database>", "Database: mongodb | mysql | postgresql")
    .option("--orm <orm>", "ORM: mongoose | prisma | drizzle")
    .option("--variant <variant>", "Variant key (components)")
    .option("--template <template>", "Template key (schemas/tooling)")
    .option("--runtime <runtime>", "Runtime: node", "node")
    .option("--files", "Show files", false)
    .action((type: string, name: string, options) =>
      viewRegistryItem({
        type,
        name,
        json: options.json,
        local: options.local,
        fw: options.fw,
        arch: options.arch,
        db: options.db,
        orm: options.orm,
        variant: options.variant,
        template: options.template,
        runtime: options.runtime,
        files: options.files
      })
    );
}
