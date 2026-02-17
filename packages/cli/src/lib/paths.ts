import path from "node:path";
import { fileURLToPath } from "node:url";
import type { RegistryType } from "@/types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getServercnRoot() {
  return path.resolve(__dirname, "../../");
}

export function resolveTargetDir(folderName: string) {
  const cwd = process.cwd();
  return path.join(cwd, folderName);
}

export const paths = {
  root: getServercnRoot(),
  registry: (f?: RegistryType) =>
    path.join(getServercnRoot(), "registry", f ? `${f}s` : ""),
  templates: () => path.join(getServercnRoot(), "templates"),
  targets: (folderName: string) => resolveTargetDir(folderName)
};
