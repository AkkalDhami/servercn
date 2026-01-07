import { ConflictStrategy } from "../lib/copy";

export interface AddOptions {
  stack?: string;
  arch?: string;
  dryRun?: boolean;
  force?: ConflictStrategy;
}

type Architecture = "mvc" | "feature" | "clean";

interface CopyOptions {
  templateDir: string;
  targetDir: string;
  componentName: string;
  conventions: NamingConventions;
  replacements?: Record<string, string>;
  conflict?: ConflictStrategy;
  dryRun?: boolean;
}

export type ServerCNConfig = {
  $schema: string;
  version: string;

  project: {
    name: string;
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

  conventions: {
    fileNaming: "kebab-case" | "camel-case" | "snake-case";
    functionNaming: "camel-case" | "pascal-case" | "snake-case";
    envFile: string;
    testDir: string;
  };

  meta: {
    createdAt: string;
    createdBy: string;
  };
};

export interface NamingConventions {
  fileNaming?: "kebab-case" | "camel-case" | "snake-case";
  functionNaming?: "camel-case" | "pascal-case" | "snake-case";
}
