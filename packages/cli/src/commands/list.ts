import { loadRegistryComponents } from "../lib/registry-list";
import { groupByCategory } from "../lib/group-by-category";
import { logger } from "../utils/cli-logger";

export async function list() {
  const components = await loadRegistryComponents();
  if (!components.length) {
    logger.warn("No components found in registry.");
    return;
  }

  const grouped = groupByCategory(components);

  for (const category of Object.keys(grouped).sort()) {
    logger.info(`\n${category.toUpperCase()}S`);

    const items = grouped[category].sort((a, b) => a.title.localeCompare(b.title));

    for (const c of items) {
      logger.log(`  • ${c.title}: ${c.slug}`);
    }
  }
}
