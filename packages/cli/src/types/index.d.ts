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
  slug: string;
}
export interface SelectPrompt {
  type: "select";
  message: string;
  key: string;
}

export interface ComponentVariant {
  label: string;
  templates: Record<FrameworkType, ArchitectureSet>;
  dependencies?: DependencySet;
  env?: string[];
}

export interface VariantComponent extends IRegistryCommon {
  slug: string;

  prompt: SelectPrompt;
  variants: Record<string, ComponentVariant>;

  //! forbidden for variant-based components
  templates?: never;
  dependencies?: never;
}

export interface SimpleComponent extends IRegistryCommon {
  slug: string;

  templates: Record<FrameworkType, ArchitectureSet>;
  dependencies?: DependencySet;

  //! forbidden for simple components
  prompt?: never;
  variants?: never;
}

export type RegistryComponent = VariantComponent | SimpleComponent;

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

export type RegistryItem =
  | RegistryComponent
  | IBlueprint
  | IFoundation
  | ISchema;
