import { IRegistryItems, ItemType } from "@/@types/registry";
import registry from "@/data/registry.json";
import { GITHUB_URL } from "./constants";

export const RESTRICTED_FOLDER_STRUCTURE_PAGES = [
  "installation",
  "introduction",
  "project-structure"
];

export const findNeighbour = (
  slug: string
): { prev: IRegistryItems | undefined; next: IRegistryItems | undefined } => {
  // First, check if this slug is a nested model (e.g., auth-user, auth-otp)
  let parentItem: IRegistryItems | undefined;
  let nestedModels: { label: string; slug: string }[] = [];

  for (const item of registry.items as unknown as IRegistryItems[]) {
    const models = item.meta?.models || item.meta?.databases;
    if (
      models &&
      models.some((m: { label: string; slug: string }) => m.slug === slug)
    ) {
      parentItem = item;
      nestedModels = models;
      break;
    }
  }

  // If it's a nested model, navigate within the parent's models only
  if (parentItem && nestedModels.length > 0) {
    const sortedModels = [...nestedModels].sort((a, b) =>
      a.label.localeCompare(b.label)
    );
    const index = sortedModels.findIndex(model => model.slug === slug);

    // Create proper registry items for prev/next with docs path
    const createNestedItem = (model: {
      label: string;
      slug: string;
    }): IRegistryItems => {
      const typePath = parentItem!.type === "schema" ? "schemas" : "blueprints";
      return {
        slug: model.slug,
        title: model.label.charAt(0).toUpperCase() + model.label.slice(1),
        type: parentItem!.type,
        docs: `/docs/${typePath}/${model.slug}`,
        description: "",
        status: parentItem!.status
      } as IRegistryItems;
    };

    return {
      prev: index > 0 ? createNestedItem(sortedModels[index - 1]) : undefined,
      next:
        index < sortedModels.length - 1
          ? createNestedItem(sortedModels[index + 1])
          : undefined
    };
  }

  const currentItem = registry.items.find(item => item.slug === slug);

  if (!currentItem) {
    return {
      prev: undefined,
      next: undefined
    };
  }

  const sameTypeItems = registry.items
    .filter(item => item.type === currentItem.type)
    .sort((a, b) => a.title.localeCompare(b.title));

  const index = sameTypeItems.findIndex(item => item.slug === slug);

  return {
    prev: index > 0 ? sameTypeItems[index - 1] : undefined,
    next:
      index < sameTypeItems.length - 1 ? sameTypeItems[index + 1] : undefined
  };
};

export function getTypeItems(type: ItemType): IRegistryItems[] {
  const items = registry.items
    .sort((a, b) => a.title.localeCompare(b.title))
    .filter(item => item.type == type && item.status == "stable")
    .map(item => ({
      title: item.title,
      url: item.docs,
      status: item.status,
      slug: item.slug,
      meta: item.meta as IRegistryItems["meta"],
      type: item.type
    }));
  return items.length > 0 ? (items as IRegistryItems[]) : [];
}

export function getGithubUrl(slug: string) {
  return `${GITHUB_URL}/tree/main/apps/web/src/content/docs/${slug}`;
}
