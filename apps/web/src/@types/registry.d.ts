interface ISchema {
  label: string;
  slug: string;
}

export interface IRegistryItems {
  slug: string;
  title: string;
  description?: string;
  type: string;
  status: string;
  docs?: string;
  url?: string;
  meta?: {
    models?: ISchema[];
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
  | "foundation";
