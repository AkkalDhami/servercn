import fs from "node:fs";
import path from "path";
import { execSync } from "child_process";
import { logger } from "@/utils/logger";
import { tsConfig } from "@/configs/ts.config";

export function ensurePackageJson(dir: string) {
  const pkgPath = path.join(dir, "package.json");

  if (fs.existsSync(pkgPath)) return;

  logger.info("Initializing package.json");

  execSync("npm init -y", {
    cwd: dir,
    stdio: "ignore"
  });
}

export function ensureTsConfig(dir: string) {
  const tsconfigPath = path.join(dir, "tsconfig.json");

  if (fs.existsSync(tsconfigPath)) return;

  fs.writeFileSync(tsconfigPath, JSON.stringify(tsConfig, null, 2));
}
