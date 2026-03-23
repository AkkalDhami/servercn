import { LATEST_VERSION, SERVERCN_URL } from "@/constants/app.constants";
import type { IServerCNConfig } from "@/types";

export const servercnConfig = (
  config: Omit<IServerCNConfig, "$schema" | "version" | "meta">,
): IServerCNConfig => {
  return {
    $schema: `${SERVERCN_URL}/schema/servercn.config.json`,
    version: LATEST_VERSION,

    rootDir: config.rootDir,
    packageManager: config.packageManager,
    runtime: config.runtime,

    language: config.language,
    framework: config.framework,
    architecture: config.architecture,

    database: config.database,
  };
};
