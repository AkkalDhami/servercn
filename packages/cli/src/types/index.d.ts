import { ConflictStrategy } from "../lib/copy";

export interface AddOptions {
  stack?: string;
  arch?: string;
  dryRun?: boolean;
  force?: ConflictStrategy;
}

type Architecture = "mvc" | "feature" | "clean";

export interface CopyOptions {
  templateDir: string;
  targetDir: string;
  componentName: string;
  conflict?: ConflictStrategy;
  dryRun?: boolean;
}

export type ServerCNConfig = {
  $schema: string;
  version: string;

  project: {
    root: string;
    srcDir: string;
    type: "backend";
    packageManager: "npm" | "pnpm" | "yarn" | "bun";
  };

  stack: {
    runtime: "node";
    language: "typescript" | "javascript";
    framework: "express";
    architecture: "mvc" | "feature" | "clean";
  };

  database: null | {
    type: "mongodb" | "postgresql" | "mysql" | "sqlite";
    orm: string;
  };

  meta: {
    createdAt: string;
    createdBy: string;
  };
};

export type PackageManager = "pnpm" | "yarn" | "npm" | "bun";

export type InstallOptions = {
  runtime?: string[];
  dev?: string[];
  cwd: string;
};

export type ItemType = "component" | "blueprint" | "guide" | "model" | "foundation";

export type StackConfig = {
  framework: "express";
  database: "mongodb" | "postgres" | "mysql";
  language: "ts" | "js";
};
