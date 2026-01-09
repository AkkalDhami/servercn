import fs from "fs-extra";
import path from "path";
import { getRegistryPath, type ItemType } from "./paths.js";
import { logger } from "../utils/cli-logger.js";

export async function getRegistryComponent(name: string, type: ItemType) {
  const registryPath = getRegistryPath(type);
  const filePath = path.join(registryPath, `${name}.json`);

  if (!(await fs.pathExists(filePath))) {
    logger.error(`Component "${name}" not found`);
    process.exit(1);
  }

  return fs.readJSON(filePath);
}
