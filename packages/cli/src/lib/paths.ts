import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Root of the installed servercn package
 * dist/lib → dist → cli → packages → servercn
 */
export function getServercnRoot() {
  return path.resolve(__dirname, "../../..");
}

export function getRegistryPath() {
  return path.join(getServercnRoot(), "packages/registry");
}
// export function getRegistryPath(folder: string) {
//   return path.join(getServercnRoot(), `packages/registry/${folder}`);
// }

export function getTemplatesPath() {
  return path.join(getServercnRoot(), "packages/templates");
}
