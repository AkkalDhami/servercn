import fs from "fs-extra";
import path from "path";
import { logger } from "../utils/logger";
import { paths } from "./paths";
import type { RegistryType } from "../types";

export async function getRegistryComponent(name: string, type: RegistryType) {
  const registryPath = paths.registry(type);
  const filePath = path.join(registryPath, `${name}.json`);

  if (!(await fs.pathExists(filePath))) {
    logger.error(`${type} "${name}" not found`);
    process.exit(1);
  }

  return fs.readJSON(filePath);
}
