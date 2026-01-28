import fs from "fs-extra";
import path from "path";
import { logger } from "../utils/logger";
import { paths } from "./paths";
import type { RegistryType } from "../types";
import { renderGrouppedRegistries } from "../commands/list";

export async function getRegistryComponent(name: string, type: RegistryType) {
  const registryPath = paths.registry(type);
  const filePath = path.join(registryPath, `${name}.json`);

  if (!(await fs.pathExists(filePath))) {
    logger.error(`${type} '${name}' not found`);
    await renderGrouppedRegistries(type);
    process.exit(1);
  }

  return fs.readJSON(filePath);
}
