import { execa } from "execa";
import { detectPackageManager } from "./detect";
import { logger } from "../utils/logger";
import type { InstallOptions } from "../types";

export async function installDependencies({
  runtime = [],
  dev = [],
  cwd
}: InstallOptions) {
  if (!runtime.length && !dev.length) return;

  const pm = detectPackageManager();

  const run = async (args: string[]) => {
    logger.info(`installing dependencies: ${args.join(" ")}`);
    await execa(pm, args, {
      cwd,
      stdio: "inherit"
    });
  };

  if (runtime.length) {
    logger.section("runtime dependencies");
    await run(getInstallArgs(pm, runtime, false));
    logger.success(
      `installed ${runtime.length} ${runtime.length > 1 ? "dependencies" : "dependency"}`
    );
  }

  if (dev.length) {
    logger.section("dev dependencies");
    await run(getInstallArgs(pm, dev, true));
    logger.success(
      `installed ${dev.length} ${dev.length > 1 ? "devDependencies" : "devDependency"}`
    );
  }
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
