export interface IRegistryItems {
  slug: string;
  title: string;
  description: string;
  type: string;
  status: string;
  docs: string;
}

export type ItemType = "component" | "blueprint" | "guide" | "model" | "foundation";
