import fs from "node:fs";
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

  const tsConfig = {
    compilerOptions: {
      target: "ES2021",
      module: "es2022",
      moduleResolution: "bundler",
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      outDir: "dist",
      rootDir: "src",
      sourceMap: true,
      alwaysStrict: true,
      useUnknownInCatchVariables: true,
      forceConsistentCasingInFileNames: true,
      paths: {
        "@/*": ["./*"]
      }
    },
    include: ["src/**/*"],
    exclude: ["node_modules"]
  };
  fs.writeFileSync(tsconfigPath, JSON.stringify(tsConfig, null, 2));
}
