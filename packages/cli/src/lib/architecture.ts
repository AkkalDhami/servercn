import path from "node:path";

export function resolveTargetDir(folderName: string) {
  const cwd = process.cwd();
  return path.join(cwd, folderName);
}
