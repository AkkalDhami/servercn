import { execa } from "execa";
import { detectPackageManager } from "./detect";
import { logger } from "../utils/cli-logger";

type InstallOptions = {
  runtime?: string[];
  dev?: string[];
  cwd: string;
};

export async function installDependencies({
  runtime = [],
  dev = [],
  cwd,
}: InstallOptions) {
  if (!runtime.length && !dev.length) return;

  const pm = detectPackageManager();

  const run = async (args: string[]) => {
    logger.info(`Installing dependencies: ${args.join(" ")}`);
    await execa(pm, args, {
      cwd,
      stdio: "inherit",
    });
  };

  if (runtime.length) {
    await run(getInstallArgs(pm, runtime, false));
  }

  if (dev.length) {
    await run(getInstallArgs(pm, dev, true));
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
