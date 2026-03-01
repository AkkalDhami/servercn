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
  if (runtime.length === 0 && dev.length === 0) return;

  const pm = detectPackageManager();

  const run = async (packages: string[], isDev: boolean) => {
    if (packages.length === 0) return;

    const label = isDev ? "devDependencies" : "dependencies";

    logger.log(`\nInstalling ${label}:`);
    packages.forEach(dep => logger.info(`- ${dep}`));
    logger.break();

    const spin = spinner(`Installing ${label} with ${pm}`)?.start();

    try {
      await execa(pm, getInstallArgs(pm, packages, isDev), {
        cwd,
        stdio: "inherit"
      });

      spin?.succeed(
        `Successfully installed ${packages.length} ${label}`
      );
    } catch (error) {
      spin?.fail(`Failed to install ${label}`);
      throw error;
    }
  };

  await run(runtime, false);
  await run(dev, true);
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
