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
