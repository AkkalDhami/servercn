import fs from "fs-extra";
import path from "node:path";
import { paths } from "./paths";
import type { RegistryData, RegistryType } from "@/types";
import { SERVERCN_URL } from "@/constants/app.constants";
import { logger } from "@/utils/logger";
import { capitalize } from "@/utils/capitalize";

export async function loadRegistryItems(
  type: RegistryType,
  local: boolean = false
) {
  if (local) {
    const registryDir = paths.localRegistry(type);
    const files = await fs.readdir(registryDir);

    const items: { slug: string }[] = [];

    for (const file of files) {
      let nestedFiles: string[] = [];
      if (!file.endsWith(".json")) {
        nestedFiles = await fs.readdir(path.join(registryDir, file));
        for (const nestedFile of nestedFiles) {
          if (!nestedFile.endsWith(".json")) continue;
          const fullPath = path.join(registryDir, file, nestedFile);
          const data = await fs.readJSON(fullPath);
          items.push(data);
        }
      } else {
        const fullPath = path.join(registryDir, file);
        const data = await fs.readJSON(fullPath);
        items.push(data);
      }
    }

    const mappedItems: RegistryData[] = items.map((item: { slug: string }) => {
      return {
        slug: item.slug,
        type
      };
    });

    return mappedItems;
  } else {
    const url = `${SERVERCN_URL}/sr/index.json`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 404) {
          logger.error(`\n${capitalize(type)} not found in registry.\n`);
        } else {
          logger.error(
            `\nFailed to fetch registry item: ${response.statusText}`
          );
        }
        process.exit(1);
      }
      const data: { items: RegistryData[] } = await response.json();
      const mappedItems = data.items.filter(item => item.type === type);
      return mappedItems;
    } catch {
      logger.error(`\nFailed to fetch registry item\n`);
      process.exit(1);
    }
  }
}
