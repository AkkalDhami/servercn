import { LATEST_VERSION, SERVERCN_URL } from "@/constants/app.constants";
import type { IServerCNConfig } from "@/types";

export const servercnConfig = (
  config: Omit<IServerCNConfig, "$schema" | "version" | "meta">,
): IServerCNConfig => {
  return {
    $schema: `${SERVERCN_URL}/schema/servercn.config.schema.json`,
    version: LATEST_VERSION,

    project: {
      root: config.project.root,
      srcDir: config.project.srcDir,
      type: config.project.type,
    },

    stack: config.stack,

    database: config.database,

    meta: {
      createdAt: new Date().toISOString(),
      createdBy: `servercn@${LATEST_VERSION}`,
    },
  };
};
