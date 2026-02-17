import { APP_NAME, SERVERCN_URL } from "@/constants/app.constants";
import type { RegistryType } from "@/types";

export const componentLogs = [
  `Add a ${APP_NAME.toLowerCase()} component using: npx servercn add <component-name>`,
  "Ex: npx servercn add http-status-codes",
  "Ex: npx servercn add jwt-utils rbac verify-auth-middleware",
  `Learn more: ${SERVERCN_URL}/components`
];

export const foundationLogs = [
  `Initialize a ${APP_NAME.toLowerCase()} foundation using: npx servercn init <foundation-name>`,
  "Ex: npx servercn init express-server",
  "Ex: npx servercn init drizzle-mysql-starter",
  "Ex: npx servercn init drizzle-pg-starter",
  `Learn more: ${SERVERCN_URL}/foundations`
];

export const blueprintLogs = [
  `Add a ${APP_NAME.toLowerCase()} blueprint using: npx servercn add blueprint <blueprint-name>`,
  "Ex: npx servercn add blueprint stateless-auth",
  `Learn more: ${SERVERCN_URL}/blueprints`
];

export const schemaLogs = [
  `Add a ${APP_NAME.toLowerCase()} schema using: npx servercn add schema <schema-name>`,
  "Ex: npx servercn add schema auth",
  "Ex: npx servercn add schema auth/user",
  "Ex: npx servercn add schema auth/otp",
  "Ex: npx servercn add schema auth/session",
  `Learn more: ${SERVERCN_URL}/schemas`
];

export const toolingLogs = [
  `Add ${APP_NAME.toLowerCase()} tooling using: npx servercn add tooling <tooling-name>`,
  "Ex: npx servercn add tooling commitlint",
  "Ex: npx servercn add tooling eslint husky prettier",
  `Learn more: ${SERVERCN_URL}`
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
