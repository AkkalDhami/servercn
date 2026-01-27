import { loadRegistry } from "../lib/registry-list";
import { groupByCategory } from "../lib/group-by-category";
import { logger } from "../utils/logger";
import { env } from "../configs/env";
import type { RegistryType } from "../types";

async function renderGrouppedRegistries(type: RegistryType, logs?: string[]) {
  const components = await loadRegistry(type);
  const groupedComponents = groupByCategory(components);
  let i = 1;
  for (const category of Object.keys(groupedComponents).sort()) {
    logger.info(`\n${category.toLowerCase()}s`);
    const items = groupedComponents[category].sort((a, b) =>
      a.title.localeCompare(b.title)
    );

    for (const c of items) {
      logger.log(`${i++}. ${c.title.toLowerCase()}: ${c.slug}`);
    }
    logger.break();
    logs && logs.map(log => logger.muted(log));
  }
}
export async function list() {
  const componentLogs = [
    "to add components run: npx servercn add <component-name>",
    "ex: npx servercn add http-status-codes",
    "ex: npx servercn add jwt-utils rbac verify-auth-middleware",
    `for more info, visit: ${env.SERVERCN_URL}/components`
  ];
  const foundationLogs = [
    "to add foundation run: npx servercn init <foundation-name>",
    "ex: npx servercn init express-server",
    "ex: npx servercn init drizzle-mysql-starter",
    "ex: npx servercn init drizzle-pg-starter",
    `for more info, visit: ${env.SERVERCN_URL}/foundations`
  ];
  const blueprintLogs = [
    "to add blueprint run: npx servercn add blueprint <blueprint-name>",
    "ex: npx servercn add blueprint stateless-auth",
    `for more info, visit: ${env.SERVERCN_URL}/blueprints`
  ];
  const schemaLogs = [
    "to add schema run: npx servercn add schema <schema-name>",
    "ex: npx servercn add schema auth",
    "ex: npx servercn add schema auth/user",
    "ex: npx servercn add schema auth/otp",
    "ex: npx servercn add schema auth/session",
    `for more info, visit: ${env.SERVERCN_URL}/schemas`
  ];
  await renderGrouppedRegistries("component", componentLogs);
  await renderGrouppedRegistries("foundation", foundationLogs);
  await renderGrouppedRegistries("blueprint", blueprintLogs);
  await renderGrouppedRegistries("schema", schemaLogs);
}
