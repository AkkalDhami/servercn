export interface ISchema {
  label: string;
  slug: string;
  new?: boolean;
}

export type Framework = "express" | "nestjs" | "nextjs";
export type StatusType =
  | "stable"
  | "unstable"
  | "beta"
  | "experimental"
  | "deprecated";

export interface IRegistryItems {
  slug: string;
  title: string;
  description?: string;
  type: string;
  status: string;
  frameworks?: string[]; // List of supported frameworks: ["express", "nestjs"]
  docs?: string;
  url?: string;
  meta?: {
    new?: boolean;
    databases?: ISchema[];
    adapters?: string[];
    useCases?: string[];
    relations?: boolean;
  };
}

export type ItemType =
  | "component"
  | "blueprint"
  | "guide"
  | "schema"
  | "foundation"
  | "tooling"
  | "contributing";

export type RegistryFile = {
  type: string;
  path: string;
  content: string;
};

export type ArchitectureType = "mvc" | "feature" | "modular" | "file-api";
export type FrameworkType = "express" | "nextjs" | "nestjs";

export type FileNode =
  | {
      type: "folder";
      name: string;
      children: FileNode[];
    }
  | {
      type: "file";
      name: string;
      path: string;
      content: string;
      lang?: string;
    };

export type ArchitectureNode = {
  files: RegistryFile[];
};

export type ComponentVariantNode = {
  label?: string;
  dependencies?: {
    runtime?: string[];
    dev?: string[];
  };
  env?: string[];
  architectures: Record<ArchitectureType, ArchitectureNode>;
};

export type ComponentFrameworkNode = {
  prompt?: string;
  env?: string[];
  architectures?: {
    [architecture: string]: ArchitectureNode;
  };
  variants?: {
    [variant: string]: ComponentVariantNode;
  };
};

export type ComponentRegistry = {
  slug: string;
  runtimes: {
    [runtime: string]: {
      frameworks: Record<FrameworkType, ComponentFrameworkNode>;
    };
  };
};

export type FoundationRegistry = {
  slug: string;
  runtimes: {
    [runtime: string]: {
      frameworks: {
        [framework: string]: {
          env?: string[];
          architectures: Record<ArchitectureType, ArchitectureNode>;
        };
      };
    };
  };
};

export type ToolingTemplateNode = {
  files: RegistryFile[];
};

export type ToolingRegistry = {
  slug: string;
  templates: {
    [template: string]: ToolingTemplateNode;
  };
  dependencies?: {
    runtime?: string[];
    dev?: string[];
  };
};

export type BlueprintOrmNode = {
  dependencies?: {
    runtime?: string[];
    dev?: string[];
  };
  env?: string[];
  architectures: {
    [architecture: string]: ArchitectureNode;
  };
};

export type BlueprintRegistry = {
  slug: string;
  runtimes: {
    [runtime: string]: {
      frameworks: {
        [framework: string]: {
          databases: {
            [database: string]: {
              orms: {
                [orm: string]: BlueprintOrmNode;
              };
            };
          };
        };
      };
    };
  };
};

export type SchemaNode = {
  dependencies?: {
    runtime?: string[];
    dev?: string[];
  };
  templates?: {
    [template: string]: {
      architectures: {
        [architecture: string]: ArchitectureNode;
        [architecture: string]: ArchitectureNode;
      };
    };
  };
};

export type SchemaRegistry = {
  slug: string;
  runtimes: {
    [runtime: string]: {
      frameworks: {
        [framework: string]: {
          databases: {
            [database: string]: {
              orms: {
                [orm: string]: SchemaNode;
              };
            };
          };
        };
      };
    };
  };
};

export type GetRegistryFileTreeOptions = {
  slug: string;
  type: ItemType;

  runtime?: string;
  framework?: string;
  architecture?: string;

  variant?: string;

  template?: string;

  database?: string;
  orm?: string;
};

export type GetRegistryFileTreeResult = {
  tree: FileNode[];
  files: RegistryFile[];

  // resolved defaults
  resolvedVariant?: string;
  resolvedTemplate?: string;
  resolvedDatabase?: string;
  resolvedOrm?: string;
};
