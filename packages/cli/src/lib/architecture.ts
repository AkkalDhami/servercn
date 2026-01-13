import path from "node:path";

export function resolveTargetDir(folderName: string, arch: string) {
  const cwd = process.cwd();

  switch (arch) {
    case "mvc":
      return path.join(cwd, folderName);

    case "feature":
      return path.join(cwd, folderName);

    case "clean":
      return path.join(cwd, folderName);

    default:
      return cwd;
  }
}
