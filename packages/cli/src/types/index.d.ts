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

export type RegistryData = {
  type: RegistryType;
  slug: string;
  frameworks?: string[];
};

export type ConflictStrategy = "skip" | "overwrite" | "error";
export interface AddOptions {
  type?: RegistryType;
  stack?: StackConfig;
  arch?: Architecture;
  force?: boolean;
  local?: boolean;
  fw?: string;
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
  engine: DatabaseType;
  adapter: OrmType;
}
export interface IServerCNConfig {
  $schema: string;
  version: string;

  rootDir: string;
  packageManager: PackageManager;
  runtime: RuntimeType;

  language: LanguageType;
  framework: FrameworkType;
  architecture: Architecture;

  database: DatabaseConfig | null;
}

export type InstallOptions = {
  runtime?: string[];
  dev?: string[];
  cwd: string;
  packageManager?: PackageManager;
};

export type DependencySet = {
  runtime?: string[];
  dev?: string[];
};

export type ArchitectureSet = {
  mvc?: string;
  feature?: string;
  modular?: string;
  "file-api"?: string;
};

export type EnvSet = string[];

export type DatabaseTemplate = Record<OrmType, ArchitectureSet>;

export type TemplateSet = Record<DatabaseType, DatabaseTemplate>;
export interface IRegistryCommon {
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
    nestjs?: FrameworkConfig;
    nextjs?: FrameworkConfig;
  };
}

export interface RegistryComponent extends IRegistryCommon {
  runtimes: {
    node: NodeRuntime;
  };
}

//? registry:foundation
export interface FoundationFramework {
  architectures: Record<
    Architecture,
    Record<"files", Array<{ type: string; path: string; content: string }>>
  >;
  templates: ArchitectureSet;
  dependencies?: DependencySet;
  env?: EnvSet;
}

export interface NodeFoundationRuntime {
  frameworks: {
    express?: FoundationFramework;
    nestjs?: FoundationFramework;
    nextjs?: FoundationFramework;
  };
}

export interface RegistryFoundation extends IRegistryCommon {
  runtimes: {
    node: NodeFoundationRuntime;
  };
}

//? registry:schema
export interface SchemaOrm {
  templates: Record<string, Record<"architectures" | ArchitectureSet>>;
  dependencies: DependencySet;
}

export interface SchemaDatabase {
  orms: Record<OrmType, SchemaOrm>;
}

export interface SchemaFramework {
  databases: Record<DatabaseType, SchemaDatabase>;
}
export interface NodeSchemaRuntime {
  frameworks: Record<FrameworkType, SchemaFramework>;
}

export interface RegistrySchema extends IRegistryCommon {
  runtimes: {
    node: NodeSchemaRuntime;
  };
}

//? registry:blueprint
export interface BlueprintOrm {
  templates: ArchitectureSet;
  dependencies: DependencySet;
}

export interface BlueprintDatabase {
  orms: Record<OrmType, BlueprintOrm>;
}

export interface BlueprintFramework {
  databases: Record<DatabaseType, BlueprintDatabase>;
}
export interface NodeBlueprinttime {
  frameworks: Record<FrameworkType, BlueprintFramework>;
}

export interface RegistryBlueprint extends IRegistryCommon {
  runtimes: {
    node: NodeBlueprinttime;
  };
}

//? registry:tooling
export interface RegistryTooling extends IRegistryCommon {
  templates: Record<string, string>;
  dependencies?: DependencySet;
}

export interface RegistryMap {
  component: RegistryComponent;
  foundation: RegistryFoundation;
  schema: RegistrySchema;
  blueprint: RegistryBlueprint;
  tooling: RegistryTooling;
}

export type RegistryItem = RegistryMap[keyof RegistryMap];
export type RuntimeRegistryItem = RegistryComponent | RegistryBlueprint;
