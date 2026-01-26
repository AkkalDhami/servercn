import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { logger } from "../utils/logger";

export function ensurePackageJson(dir: string) {
  const pkgPath = path.join(dir, "package.json");

  if (fs.existsSync(pkgPath)) return;

  logger.info("initializing package.json");

  execSync("npm init -y", {
    cwd: dir,
    stdio: "ignore"
  });
}

export function ensureTsConfig(dir: string) {
  const tsconfigPath = path.join(dir, "tsconfig.json");

  if (fs.existsSync(tsconfigPath)) return;

  const tsconfig = {
    compilerOptions: {
      target: "ES2021",
      module: "NodeNext",
      moduleResolution: "NodeNext",
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      outDir: "dist",
      rootDir: "src"
    },
    include: ["src"]
  };

  fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
}
