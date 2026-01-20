import { loadRegistry } from "../lib/registry-list";
import { groupByCategory } from "../lib/group-by-category";
import { logger } from "../utils/cli-logger";
import type { RegistryType } from "../types/registry";
import { env } from "../configs/env";

async function renderGrouppedRegistries(type: RegistryType, logs?: string[]) {
  const components = await loadRegistry(type);
  const groupedComponents = groupByCategory(components);
  let i = 1;
  for (const category of Object.keys(groupedComponents).sort()) {
    logger.info(`\n${category.toUpperCase()}S`);
    const items = groupedComponents[category].sort((a, b) =>
      a.title.localeCompare(b.title)
    );

    for (const c of items) {
      logger.log(`${i++}. ${c.title}: ${c.slug}`);
    }
    logger.break();
    logs && logs.map(log => logger.muted(log));
  }
}
export async function list() {
  const componentLogs = [
    "To add components run: npx servercn add <component-name>",
    "Ex: npx servercn add http-status-codes",
    "Ex: npx servercn add jwt-utils rbac verify-auth-middleware",
    `For more info, visit: ${env.SERVERCN_URL}/components`
  ];
  const foundationLogs = [
    "To add foundation run: npx servercn init <foundation-name>",
    "Ex: npx servercn init express-server",
    "Ex: npx servercn init drizzle-mysql-starter",
    `For more info, visit: ${env.SERVERCN_URL}/foundations`
  ];
  const blueprintLogs = [
    "To add blueprint run: npx servercn add blueprint <blueprint-name>",
    "Ex: npx servercn add blueprint jwt-utils rbac verify-auth-middleware",
    `For more info, visit: ${env.SERVERCN_URL}/blueprints`
  ];
  const schemaLogs = [
    "To add schema run: npx servercn add schema <schema-name>",
    "Ex: npx servercn add schema auth/user",
    "Ex: npx servercn add schema auth/otp",
    "Ex: npx servercn add schema auth/session",
    `For more info, visit: ${env.SERVERCN_URL}/schemas`
  ];
  await renderGrouppedRegistries("component", componentLogs);
  await renderGrouppedRegistries("foundation", foundationLogs);
  await renderGrouppedRegistries("blueprint", blueprintLogs);
  await renderGrouppedRegistries("schema", schemaLogs);
}
