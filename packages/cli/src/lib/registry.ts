import fs from "fs-extra";
import path from "path";
import { logger } from "@/utils/logger";
import { paths } from "./paths";
import type { RegistryMap } from "@/types";
import { capitalize } from "@/utils/capitalize";
import { getRegistryLists } from "@/commands/list/list.handlers";

import { SERVERCN_URL } from "@/constants/app.constants";

export async function getRegistry<T extends keyof RegistryMap>(
  name: string,
  type: T,
  local?: boolean
): Promise<RegistryMap[T]> {
  const registryItemName = name.includes("/")
    ? name.split("/").shift() || name
    : name;

  if (local) {
    const registryPath = paths.localRegistry(type);

    if (!(await fs.pathExists(registryPath))) {
      logger.break();
      logger.error(
        "Something went wrong. Please check the error below for more details."
      );
      logger.error(`\nRegistry path not found`);
      logger.error("\nCheck if the item name is correct.");
      logger.break();
      process.exit(1);
    }

    const filePath = path.join(registryPath, `${registryItemName}.json`);

    if (!(await fs.pathExists(filePath))) {
      logger.break();
      logger.error(
        "Something went wrong. Please check the error below for more details."
      );
      logger.error(`\n${capitalize(type)} '${name}' not found!`);
      logger.break();

      await getRegistryLists(type);

      process.exit(1);
    }

    return fs.readJSON(filePath);
  } else {
    // Production: Try local built files first if in monorepo (for testing), else fetch
    const localBuiltPath = path.join(
      paths.outputBase,
      type,
      `${registryItemName}.json`
    );

    if (await fs.pathExists(localBuiltPath)) {
      return fs.readJSON(localBuiltPath);
    }

    // Fetch from SERVERCN_URL
    const url = `${SERVERCN_URL}/sr/v1/${type}/${registryItemName}.json`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 404) {
          logger.error(
            `\n${capitalize(type)} '${name}' not found in registry.`
          );
        } else {
          logger.error(
            `\nFailed to fetch registry item: ${response.statusText}`
          );
        }
        process.exit(1);
      }
      return (await response.json()) as RegistryMap[T];
    } catch (error) {
      logger.error(`\nNetwork error: ${error}`);
      process.exit(1);
    }
  }
}
