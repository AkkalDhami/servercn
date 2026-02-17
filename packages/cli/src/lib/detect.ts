import fs from "node:fs";
import path from "node:path";
import type { PackageManager } from "@/types";

export function detectPackageManager(cwd = process.cwd()): PackageManager {
  if (fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(cwd, "yarn.lock"))) return "yarn";
  if (fs.existsSync(path.join(cwd, "bun.lockb"))) return "bun";
  return "npm";
}
