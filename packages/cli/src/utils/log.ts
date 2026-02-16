import { env } from "@/configs/env";
import { APP_NAME } from "@/constants/app-constants";
import type { RegistryType } from "@/types";

export const componentLogs = [
  `To Add ${APP_NAME} Component Run: npx servercn add <component-name>`,
  "ex: npx servercn add http-status-codes",
  "ex: npx servercn add jwt-utils rbac verify-auth-middleware",
  `For more info, Visit: ${env.SERVERCN_URL}/components`
];
export const foundationLogs = [
  `To Add ${APP_NAME} Foundation Run: npx servercn init <foundation-name>`,
  "ex: npx servercn init express-server",
  "ex: npx servercn init drizzle-mysql-starter",
  "ex: npx servercn init drizzle-pg-starter",
  `For more info, Visit: ${env.SERVERCN_URL}/foundations`
];
export const blueprintLogs = [
  `To Add ${APP_NAME} Blueprint Run: npx servercn add blueprint <blueprint-name>`,
  "ex: npx servercn add blueprint stateless-auth",
  `For more info, Visit: ${env.SERVERCN_URL}/blueprints`
];
export const schemaLogs = [
  `To Add ${APP_NAME} Schema Run: npx servercn add schema <schema-name>`,
  "ex: npx servercn add schema auth",
  "ex: npx servercn add schema auth/user",
  "ex: npx servercn add schema auth/otp",
  "ex: npx servercn add schema auth/session",
  `For more info, Visit: ${env.SERVERCN_URL}/schemas`
];
export const toolingLogs = [
  `To Add ${APP_NAME} Tooling Run: npx servercn add tooling <tooling-name>`,
  "ex: npx servercn add tooling commitlint",
  "ex: npx servercn add tooling eslint husky prettier",
  `For more info, Visit: ${env.SERVERCN_URL}`
];

export function logInfo(type: RegistryType) {
  switch (type) {
    case "component":
      return componentLogs;
    case "blueprint":
      return blueprintLogs;
    case "schema":
      return schemaLogs;
    case "foundation":
      return foundationLogs;
    case "tooling":
      return toolingLogs;

    default:
      return componentLogs;
  }
}
