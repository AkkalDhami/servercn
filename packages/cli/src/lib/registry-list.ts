import fs from "fs-extra";
import path from "node:path";
import { getRegistryPath } from "./paths";

export async function loadRegistryComponents() {
  const registryDir = getRegistryPath("component");
  const files = await fs.readdir(registryDir);

  const components = [];

  for (const file of files) {
    if (!file.endsWith(".json")) continue;

    const fullPath = path.join(registryDir, file);
    const data = await fs.readJSON(fullPath);

    components.push(data);
  }

  return components;
}
