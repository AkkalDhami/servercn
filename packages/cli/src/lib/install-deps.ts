import { execa } from "execa";
import { detectPackageManager } from "./detect";
import { logger } from "@/utils/logger";
import type { InstallOptions } from "@/types";
import { spinner } from "@/utils/spinner";

export async function installDependencies({
  runtime = [],
  dev = [],
  cwd
}: InstallOptions) {
  if (runtime.length < 1 && dev.length < 1) return;

  const pm = detectPackageManager();

  logger.log("\nInstalling Dependencies:");
  runtime.forEach(dep => logger.info(`- ${dep}`));

  logger.log("\nInstalling devDependencies:");
  dev.forEach(dep => logger.info(`- ${dep}`));

  logger.break();
  const result = spinner("Installing Dependencies")?.start();

  const run = async (args: string[]) => {
    await execa(pm, args, {
      cwd,
      stdio: "inherit"
    });
  };

  result?.succeed(
    `Installed ${runtime.length} ${runtime.length > 1 ? "Dependencies" : "Dependency"}`
  );
  await run(getInstallArgs(pm, runtime, false));

  await run(getInstallArgs(pm, dev, true));
  result?.succeed(
    `Installed ${dev.length} ${dev.length > 1 ? "devDependencies" : "devDependency"}`
  );
}

function getInstallArgs(
  pm: string,
  packages: string[],
  isDev: boolean
): string[] {
  switch (pm) {
    case "pnpm":
      return ["add", ...(isDev ? ["-D"] : []), ...packages];

    case "yarn":
      return ["add", ...(isDev ? ["-D"] : []), ...packages];

    case "bun":
      return ["add", ...(isDev ? ["-d"] : []), ...packages];

    case "npm":
    default:
      return ["install", ...(isDev ? ["--save-dev"] : []), ...packages];
  }
}
