import type {
  ArchitectureList,
  DatabaseList,
  RegistryTypeList,
  PackageManagerList
} from "../constants/app-constants";
import { ConflictStrategy } from "../lib/copy";

export type Architecture = (typeof ArchitectureList)[number];
export type Database = (typeof DatabaseList)[number];
export type RegistryType = (typeof RegistryTypeList)[number];
export type PackageManager = (typeof PackageManagerList)[number];

export interface AddOptions {
  type?: RegistryType;
  stack?: string;
  arch?: string;
  dryRun?: boolean;
  force?: ConflictStrategy;
  variant?: string;
}

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
    packageManager: PackageManager;
  };

  stack: {
    runtime: "node";
    language: "typescript" | "javascript";
    framework: "express";
    architecture: Architecture;
  };

  database: null | {
    type: Database;
    orm: string;
  };

  meta: {
    createdAt: string;
    createdBy: string;
  };
};

export type InstallOptions = {
  runtime?: string[];
  dev?: string[];
  cwd: string;
};

export type StackConfig = {
  framework: "express";
  database: Database;
  language: "ts";
};
