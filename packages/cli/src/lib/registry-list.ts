import fs from "fs-extra";
import path from "node:path";
import { paths } from "./paths";
import type { RegistryType } from "@/types";
export async function loadRegistry(type: RegistryType) {
  const registryDir = paths.registry(type);
  const files = await fs.readdir(registryDir);

  const components = [];

  for (const file of files) {
    let nestedFiles: string[] = [];
    if (!file.endsWith(".json")) {
      nestedFiles = await fs.readdir(path.join(registryDir, file));
      for (const nestedFile of nestedFiles) {
        if (!nestedFile.endsWith(".json")) continue;
        const fullPath = path.join(registryDir, file, nestedFile);
        const data = await fs.readJSON(fullPath);
        components.push(data);
      }
    } else {
      const fullPath = path.join(registryDir, file);
      const data = await fs.readJSON(fullPath);
      components.push(data);
    }
  }

  return components;
}
