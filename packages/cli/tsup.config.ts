import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/cli.ts"],
  format: ["esm"],
  target: "es2022",
  outDir: "dist",

  clean: true,
  dts: false,
  splitting: false,
  sourcemap: true,
  shims: false
});
