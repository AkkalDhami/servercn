import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "**/.next/**",
    "out/**",
    "**/out/**",
    "build/**",
    "**/build/**",
    "dist/**",
    "**/dist/**",
    "next-env.d.ts",
    "**/next-env.d.ts",
    "node_modules/**",
    "**/node_modules/**",
    ".source/**",
    "**/__index__.tsx",
    "commitlint.config.ts",
    "**/packages/templates/**"
  ]),
  {
    settings: {
      next: {
        rootDir: "apps/web"
      }
    },
    rules: {
      "@typescript-eslint/no-unused-expressions": "off"
    }
  }
]);

export default eslintConfig;
