import type {
  ArchitectureList,
  DatabaseList,
  RegistryTypeList,
  OrmList,
  FrameworkList,
  RuntimeList,
  LanguageList
} from "@/constants/app.constants";

export type Architecture = (typeof ArchitectureList)[number];
export type DatabaseType = (typeof DatabaseList)[number];
export type RegistryType = (typeof RegistryTypeList)[number];
export type OrmType = (typeof OrmList)[number];
export type FrameworkType = (typeof FrameworkList)[number];
export type RuntimeType = (typeof RuntimeList)[number];
export type LanguageType = (typeof LanguageList)[number];
export type PackageManager = "npm" | "yarn" | "pnpm" | "bun";

export type ConflictStrategy = "skip" | "overwrite" | "error";
export interface AddOptions {
  type?: RegistryType;
  stack?: StackConfig;
  arch?: Architecture;
  force?: boolean;
  local?: boolean;
  variant?: string;
}
export interface CopyOptions {
  templateDir: string;
  targetDir: string;
  registryItemName: string;
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
  $schema: string;
  version: string;
  project: {
    root: string;
    srcDir: string;
    type: "backend" | "fullstack";
  };
  stack: StackConfig;
  database: null | DatabaseConfig;
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
  runtime?: string[];
  dev?: string[];
};

export type ArchitectureSet = {
  mvc?: string;
  feature?: string;
};

export type EnvSet = string[];

export type DatabaseTemplate = Record<OrmType, ArchitectureSet>;

export type TemplateSet = Record<DatabaseType, DatabaseTemplate>;
export interface IRegistryCommon {
  $schema?: string;
  slug: string;
}

//? registry:component
export interface SimpleFramework {
  templates: ArchitectureSet;
  dependencies?: DependencySet;
  env?: EnvSet;

  // forbidden
  prompt?: never;
  variants?: never;
}

export interface FrameworkVariant {
  label: string;
  templates: ArchitectureSet;
  dependencies?: DependencySet;
  env?: EnvSet;
}

export interface VariantFramework {
  prompt: string;
  variants: Record<string, FrameworkVariant>;

  // forbidden
  templates?: never;
  dependencies?: never;
  env?: never;
}

export type FrameworkConfig = VariantFramework | SimpleFramework;

export interface NodeRuntime {
  frameworks: {
    express?: FrameworkConfig;
    nest?: FrameworkConfig;
  };
}

export interface RegistryComponent extends IRegistryCommon {
  runtimes: {
    node: NodeRuntime;
  };
}

//? registry:foundation
export interface FoundationFramework {
  templates: ArchitectureSet;
  dependencies?: DependencySet;
  env?: EnvSet;
}

export interface NodeFoundationRuntime {
  frameworks: {
    express?: FoundationFramework;
    nest?: FoundationFramework;
  };
}

export interface RegistryFoundation extends IRegistryCommon {
  runtimes: {
    node: NodeFoundationRuntime;
  };
}

//? registry:schema
export interface SchemaOrm {
  templates: Record<string, ArchitectureSet>;
  dependencies: DependencySet
}

export interface SchemaDatabase {
  orms: Record<OrmType, SchemaOrm>;
}

export interface SchemaFramework {
  databases: Record<DatabaseType, SchemaDatabase>;
}
export interface NodeSchemaRuntime {
  frameworks: Record<FrameworkType, SchemaFramework>
}

export interface RegistrySchema extends IRegistryCommon {
  runtimes: {
    node: NodeSchemaRuntime;
  };
}


//? registry:tooling
export interface RegistryTooling extends IRegistryCommon {
  templates: Record<string, string>,
  dependencies?: DependencySet;
}

//? registry:blueprint
export interface RegistryBlueprint extends IRegistryCommon {
  runtimes: {
    node: NodeSchemaRuntime;
  };
  dependencies: Record<string, DependencySet>;
}

export interface RegistryMap {
  component: RegistryComponent;
  foundation: RegistryFoundation;
  schema: RegistrySchema;
  blueprint: RegistryBlueprint;
  tooling: RegistryTooling;
}

export type RegistryItem = RegistryMap[keyof RegistryMap];
export type RuntimeRegistryItem =
  | RegistryComponent
  | RegistryBlueprint

// | RegistrySchema