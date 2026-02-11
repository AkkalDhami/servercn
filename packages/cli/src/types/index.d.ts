import type {
  ArchitectureList,
  DatabaseList,
  RegistryTypeList,
  OrmList,
  FrameworkList,
  RuntimeList,
  LanguageList
} from "../constants/app-constants";
import { ConflictStrategy } from "../lib/copy";

export type Architecture = (typeof ArchitectureList)[number];
export type DatabaseType = (typeof DatabaseList)[number];
export type RegistryType = (typeof RegistryTypeList)[number];
export type OrmType = (typeof OrmList)[number];
export type FrameworkType = (typeof FrameworkList)[number];
export type RuntimeType = (typeof RuntimeList)[number];
export type LanguageType = (typeof LanguageList)[number];
export type PackageManager = "npm" | "yarn" | "pnpm" | "bun";
export interface AddOptions {
  type?: RegistryType;
  stack?: StackConfig;
  arch?: Architecture;
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

export type StackConfig = {
  runtime: RuntimeType;
  language: LanguageType;
  framework: FrameworkType;
  architecture: Architecture;
};

export interface DatabaseConfig {
  type: DatabaseType;
  orm: OrmType;
}

export interface IServerCNConfig {
  version: string;

  project: {
    root: string;
    srcDir: string;
    type: string;
  };

  stack: StackConfig;

  database: null | DatabaseConfig;

  overrides: Record<string, string>;

  meta: {
    createdAt: string;
    createdBy: string;
  };
}

export type InstallOptions = {
  runtime?: string[];
  dev?: string[];
  cwd: string;
};

export type DependencySet = {
  runtime: string[];
  dev: string[];
};

export type ArchitectureSet = {
  mvc: string;
  feature: string;
};

export type DatabaseTemplate = Record<OrmType, ArchitectureSet>;

export type TemplateSet = Record<DatabaseType, DatabaseTemplate>;

export interface IRegistryCommon {
  title: string;
  slug: string;
  type: RegistryType;
  stacks: Array<FrameworkList>;
  architectures: Array<Architecture>;
  env?: Array<string>;
}

export interface IComponent extends IRegistryCommon {
  templates: Record<FrameworkType, ArchitectureSet>;
  dependencies: DependencySet;
  algorithms?: Record<string, DependencySet>;
}

export interface IBlueprint extends IRegistryCommon {
  templates: Record<FrameworkType, TemplateSet>;
  dependencies: Record<string, DependencySet>;
}

export interface IFoundation extends IRegistryCommon {
  templates: Record<FrameworkType, ArchitectureSet>;
  dependencies: DependencySet;
}

export interface ISchema extends IRegistryCommon {
  templates: Record<FrameworkType, TemplateSet>;
  dependencies: Record<string, DependencySet>;
}

export type RegistryItem = IComponent | IBlueprint | IFoundation | ISchema;
