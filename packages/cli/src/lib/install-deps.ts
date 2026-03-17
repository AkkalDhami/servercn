import { execa } from "execa";
import { detectPackageManager } from "./detect";
import { logger } from "@/utils/logger";
import type { InstallOptions } from "@/types";
import { spinner } from "@/utils/spinner";

const clean = (arr: string[]) =>
  arr.filter(dep => typeof dep === "string" && dep.trim().length > 0);

export async function installDependencies({
  runtime = [],
  dev = [],
  cwd,
  packageManager
}: InstallOptions) {
  const runtimeDeps = clean(runtime);
  const devDeps = clean(dev);

  if (runtimeDeps.length === 0 && devDeps.length === 0) return;

  if (runtimeDeps.length > 0) {
    logger.log("\nInstalling dependencies:");
    runtimeDeps.forEach(dep => logger.info(`- ${dep}`));
  }

  if (devDeps.length > 0) {
    logger.log("\nInstalling devDependencies:");
    devDeps.forEach(dep => logger.info(`- ${dep}`));
  }

  if (runtimeDeps.length > 0 || devDeps.length > 0) {
    logger.break();
  }
  const pm = packageManager ?? detectPackageManager();

  const run = async (packages: string[], isDev: boolean) => {
    const label = isDev ? "devDependencies" : "dependencies";

    if (packages.length === 0) return;

    const spin = spinner(`Installing ${label} with ${pm}`)?.start();

    try {
      await execa(pm, getInstallArgs(pm, packages, isDev), {
        cwd,
        stdio: "pipe"
      });

      spin?.succeed(`Successfully installed ${packages.length} ${label}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      spin?.fail(`Failed to install ${label}`);
      logger.error(error.stderr || error.message);
      throw error;
    }
  };

  await run(runtimeDeps, false);
  await run(devDeps, true);
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
