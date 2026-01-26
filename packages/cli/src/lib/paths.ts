import path from "path";
import { fileURLToPath } from "url";
import type { ItemType } from "../types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Absolute path to the installed servercn package root
 * dist/utils → dist → package root
 */
export function getServercnRoot() {
  return path.resolve(__dirname, "../");
}

export const paths = {
  root: getServercnRoot(),
  registry: (f?: ItemType) =>
    path.join(getServercnRoot(), "registry", f ? `${f}s` : ""),
  templates: () => path.join(getServercnRoot(), "templates")
};
