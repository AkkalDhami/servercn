import path from "node:path";
import { fileURLToPath } from "node:url";
import type { RegistryType } from "@/types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Absolute path to the installed servercn package root
 * dist/utils → dist → package root
 */
export function getServercnRoot() {
  return path.resolve(__dirname, "@/../");
}

export const paths = {
  root: getServercnRoot(),
  registry: (f?: RegistryType) =>
    path.join(getServercnRoot(), "registry", f ? `${f}s` : ""),
  templates: () => path.join(getServercnRoot(), "templates")
};
