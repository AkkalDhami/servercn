export interface ISchema {
  label: string;
  slug: string;
  new?: boolean;
}

export type Framework = "express" | "nestjs";
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
