import { Framework, IRegistryItems, ItemType } from "@/@types/registry";
import registry from "@/data/registry.json";

export const RESTRICTED_FOLDER_STRUCTURE_PAGES = [
  "installation",
  "introduction",
  "cli",
];

export const FRAMEWORK_SECTIONS = [
  "blueprints",
  "components",
  "foundations",
  "schemas"
];

const STABLE_REGISTRY = registry.items;

export const findNeighbour = (
  slug: string
): { prev: IRegistryItems | undefined; next: IRegistryItems | undefined } => {
  // First, check if this slug is a nested model (e.g., auth-user, auth-otp)
  let parentItem: IRegistryItems | undefined;
  const nestedModels: { label: string; slug: string }[] = [];

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

  const currentItem = STABLE_REGISTRY.find(item => item.slug === slug);

  if (!currentItem) {
    return {
      prev: undefined,
      next: undefined
    };
  }

  const sameTypeItems = STABLE_REGISTRY.filter(
    item => item.type === currentItem.type
  ).sort((a, b) => a.title.localeCompare(b.title));

  const index = sameTypeItems.findIndex(item => item.slug === slug);

  return {
    prev: index > 0 ? sameTypeItems[index - 1] : undefined,
    next:
      index < sameTypeItems.length - 1 ? sameTypeItems[index + 1] : undefined
  };
};

export function getRegistryTypeItems(
  type: ItemType,
  framework: Framework = "express"
): IRegistryItems[] {
  const items = registry.items
    .sort((a, b) => a.title.localeCompare(b.title))
    .filter(item => {
      // Filter by type
      if (item.type !== type) return false;

      // If no framework filter or item has no framework restrictions, include it
      if (!framework || !item.frameworks || item.frameworks.length === 0) {
        return true;
      }

      // Check if item supports the selected framework
      return item.frameworks.includes(framework);
    })
    .map(item => ({
      title: item.title,
      description: item.description,
      url: ["guide", "tooling", "contributing"].includes(item.type)
        ? item.docs
        : item.docs.replace("/docs/", `/docs/${framework}/`),
      status: item.status,
      slug: item.slug,
      frameworks: item.frameworks,
      meta: {
        new: item.meta?.new,
        databases: item.meta?.databases?.map(db => ({
          ...db,
          slug: `${framework}/${item.type}s/${db.slug}`
        }))
      },
      type: item.type
    }));
  return items.length > 0 ? (items as IRegistryItems[]) : [];
}
