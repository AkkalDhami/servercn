import fs from "fs-extra";
import path from "path";
import { logger } from "@/utils/logger";
import { paths } from "./paths";
import type { RegistryMap } from "@/types";
import { capitalize } from "@/utils/capitalize";
import { getRegistryLists } from "@/commands/list/list.handlers";

export async function getRegistry<T extends keyof RegistryMap>(
  name: string,
  type: T
): Promise<RegistryMap[T]> {
  // implementation
  const registryPath = paths.registry(type);

  const registryItemName = name.includes("/")
    ? name.split("/").shift() || name
    : name;

  const filePath = path.join(registryPath, `${registryItemName}.json`);

  // console.log({ registryItemName })
  if (!(await fs.pathExists(filePath))) {
    logger.break();
    logger.error(
      "Something went wrong. Please check the error below for more details."
    );
    logger.error(`\n${capitalize(type)} '${name}' not found!`);
    logger.error("\nCheck if the item name is correct.");

    await getRegistryLists(type);

    process.exit(1);
  }

  return fs.readJSON(filePath);
}
