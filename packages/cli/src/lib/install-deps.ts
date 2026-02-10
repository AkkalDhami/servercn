import { execa } from "execa";
import { detectPackageManager } from "./detect";
import { logger } from "../utils/logger";
import type { InstallOptions } from "../types";
import { spinner } from "../utils/spinner";

export async function installDependencies({
  runtime = [],
  dev = [],
  cwd
}: InstallOptions) {
  if (!runtime.length && !dev.length) return;

  const pm = detectPackageManager();

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
  // logger.success(
  //   `Installed ${runtime.length} ${runtime.length > 1 ? "Dependencies" : "Dependency"}`
  // );

  await run(getInstallArgs(pm, dev, true));
  result?.succeed(
    `Installed ${dev.length} ${dev.length > 1 ? "DevDependencies" : "DevDependency"}`
  );
  // logger.success(
  //   `Installed ${dev.length} ${dev.length > 1 ? "DevDependencies" : "DevDependency"}`
  // );
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
