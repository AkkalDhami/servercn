import path from "path";
import { fileURLToPath } from "url";
import type { ItemType } from "../types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Root of the installed servercn package
 * dist/lib → dist → cli → packages → servercn
 */
export function getServercnRoot() {
  return path.resolve(__dirname, "../../..");
}

export function getRegistryPath(folder: ItemType) {
  const folderName = folder ? `/${folder}s` : "";

  return path.join(getServercnRoot(), `packages/registry${folderName}`);
}

export function getTemplatesPath() {
  return path.join(getServercnRoot(), `packages/templates/`);
}
