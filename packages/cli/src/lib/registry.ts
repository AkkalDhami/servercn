import fs from "fs-extra";
import path from "path";
import { logger } from "../utils/logger";
import { paths } from "./paths";
import type { RegistryType } from "../types";
import { renderGrouppedRegistries } from "../commands/list";
import { capitalize } from "../utils/capitalize";
import { logInfo } from "../utils/log";

export async function getRegistryComponent(name: string, type: RegistryType) {
  const registryPath = paths.registry(type);
  const filePath = path.join(registryPath, `${name}.json`);

  if (!(await fs.pathExists(filePath))) {
    logger.break();
    logger.error(
      "Something went wrong. Please check the error below for more details."
    );
    logger.error(`\n${capitalize(type)} '${name}' not found!`);
    logger.error("\nCheck if the item name is correct.");
    await renderGrouppedRegistries(type, logInfo(type));
    process.exit(1);
  }

  return fs.readJSON(filePath);
}
