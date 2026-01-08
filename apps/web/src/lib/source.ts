import { IRegistryItems, ItemType } from "@/@types/registry";
import registry from "@/data/registry.json";

export const RESTRICTED_FOLDER_STRUCTURE_PAGES = [
  "installation",
  "introduction",
  "project-structure",
];

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

export function getTypeItems(type: ItemType) {
  const items = registry.items
    .sort((a, b) => a.title.localeCompare(b.title))
    .filter((item) => item.type == type)
    .map((item) => ({
      title: item.title,
      url: item.docs,
      status: item.status,
    }));
  return items.length > 0 ? items : [];
}
