import { loadRegistry } from "../lib/registry-list";
import { groupByCategory } from "../lib/group-by-category";
import { logger } from "../utils/logger";
import type { RegistryType } from "../types";
import {
  blueprintLogs,
  componentLogs,
  foundationLogs,
  schemaLogs,
  toolingLogs
} from "../utils/log";
import { capitalize } from "../utils/capitalize";

export async function renderGrouppedRegistries(
  type: RegistryType,
  logs?: string[]
) {
  const components = await loadRegistry(type);
  const groupedComponents = groupByCategory(components);
  let i = 1;
  for (const category of Object.keys(groupedComponents).sort()) {
    logger.info(`\nAvailable ${capitalize(category)}s:`);
    const items = groupedComponents[category].sort((a, b) =>
      a.title.localeCompare(b.title)
    );

    for (const c of items) {
      logger.log(`${i++}. ${capitalize(c.title)}: ${c.slug}`);
    }
    logger.break();
    logs && logs.map(log => logger.muted(log));
  }
}
export async function list() {
  await renderGrouppedRegistries("component", componentLogs);
  await renderGrouppedRegistries("foundation", foundationLogs);
  await renderGrouppedRegistries("blueprint", blueprintLogs);
  await renderGrouppedRegistries("schema", schemaLogs);
  await renderGrouppedRegistries("tooling", toolingLogs);
}
