import registry from "@/data/registry.json";

export const RESTRICTED_FOLDER_STRUCTURE_PAGES = [
  "installation",
  "introduction",
  "project-structure",
];

export interface IRegistryItems {
  slug: string;
  title: string;
  description: string;
  type: string;
  status: string;
  docs: string;
}

export const findNeighbour = (
  slug: string,
): { prev: IRegistryItems; next: IRegistryItems } => {
  const index = registry.items
    .sort((a, b) => a.title.localeCompare(b.title))
    .findIndex((item) => item.slug === slug);
  return {
    prev: registry.items[index - 1],
    next: registry.items[index + 1],
  };
};
