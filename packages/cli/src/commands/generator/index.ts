import type { Command } from "commander";
import {
  generateController,
  generateModel,
  generateResource,
  generateRoute,
  generateService,
  resolveGeneratorType
} from "./generator.handlers";
import { logger } from "@/utils/logger";
import ora from "ora";

export interface GeneratorOptions {
  force?: boolean;
}

export function registryGeneratorCommand(program: Command) {
  const generateCommand = program
    .command("generate <type> <name>")
    .alias("g")
    .description(
      "Generate resources (controller, service, resource, model, route, etc.)"
    )
    .option("--force", "Overwrite existing files")

    .action(async (type, name, options: GeneratorOptions) => {
      try {
        const generators = {
          controller: generateController,
          service: generateService,
          resource: generateResource,
          model: generateModel,
          route: generateRoute
        };

        const spinner = ora({
          text: `Generating ${type}: ${name}...`,
          color: "blue"
        });

        spinner.start();
        const resolvedType = resolveGeneratorType(type);
        const generator = generators[resolvedType as keyof typeof generators];

        if (!generator) {
          spinner.stop();
          logger.error(`Unknown generator type: ${type}\n`);

          logger.info("Available generators:");
          logger.info(" → controller (co)");
          logger.info(" → service (se)");
          logger.info(" → model (mo)");
          logger.info(" → route (ro)");
          logger.info(" → resource (re)");

          process.exit(1);
        }

        logger.break();
        await generator(name, options);

        logger.break();
        spinner.succeed(`Successfully generated ${resolvedType}: ${name}`);
        logger.break();
      } catch (error) {
        logger.error(`Failed to generate ${type}: ${name}`);
        logger.error(error);
        process.exit(1);
      }
    });

  generateCommand.addHelpText(
    "after",
    `
Aliases:
  co → controller
  se → service
  mo → model
  ro → route
  re → resource

Examples:
  $ npx servercn-cli g co user
  $ npx servercn-cli g re auth 
  $ npx servercn-cli g mo user
  $ npx servercn-cli g ro user
  $ npx servercn-cli g se user
`
  );
}
