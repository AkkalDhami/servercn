import { SERVERCN_URL } from "@/constants/app.constants";
import { loadRegistry } from "@/lib/registry-list";
import type { RegistryComponent, RegistryType } from "@/types";
import { highlighter } from "@/utils/highlighter";
import { logger } from "@/utils/logger";

export type listOptionType = {
  json?: boolean;
};

function padStart(num: number = 0) {
  return num.toString().padStart(2, "0");
}

export async function listOverview(options: listOptionType) {
  const components = await loadRegistry("component");
  const blueprints = await loadRegistry("blueprint");
  const foundations = await loadRegistry("foundation");
  const toolings = await loadRegistry("tooling");
  const schemas = await loadRegistry("schema");
  const data = {
    command: "npx servercn list <type>",
    types: [
      {
        type: "components",
        shortcut: "cp",
        total: components.length,
        command: "npx servercn list cp"
      },
      {
        type: "blueprints",
        shortcut: "bp",
        total: blueprints.length,
        command: "npx servercn list bp"
      },
      {
        type: "foundations",
        shortcut: "fd",
        total: foundations.length,
        command: "npx servercn list fd"
      },
      {
        type: "tooling",
        shortcut: "tl",
        total: toolings.length,
        command: "npx servercn list tl"
      },
      {
        type: "schemas",
        shortcut: "sc",
        total: schemas.length,
        command: "npx servercn list sc"
      }
    ]
  };

  if (options?.json) {
    logger.break();
    process.stdout.write(JSON.stringify(data, null, 2));
    logger.break();
    return;
  }

  logger.break();
  logger.info("ServerCN Registry Overview");
  console.log(
    `${highlighter.create(`
───────────────────────────────────────────────────────────
│ Type         │ Shortcut │ Total │ Command               │
───────────────────────────────────────────────────────────
│ Components   │   cp     │  ${padStart(components.length)}   │ npx servercn list cp  │ 
│ Blueprints   │   bp     │  ${padStart(blueprints.length)}   │ npx servercn list bp  │
│ Foundations  │   fd     │  ${padStart(foundations.length)}   │ npx servercn list fd  │
│ Tooling      │   tl     │  ${padStart(toolings.length)}   │ npx servercn list tl  │
│ Schemas      │   sc     │  ${padStart(schemas.length)}   │ npx servercn list sc  │
───────────────────────────────────────────────────────────`)}`);
  logger.log(`
 Explore:
 npx servercn list <type | shortcut>

 Examples:
 npx servercn list components
 npx servercn list cp
 npx servercn list schemas
`);
}

type listRegistryDataType = {
  type: RegistryType;
  total: number;
  items: {
    name: string;
    command: string;
    frameworks: string[];
    variants?: string[];
  }[];
};

// shortcut: "cp" | "fd" | "bp" | "tl" | "sc";
export async function listComponents(options: listOptionType) {
  logger.break();
  logger.info("Available Components");
  const components: RegistryComponent[] = await loadRegistry("component");
  const data = {
    type: "component",
    total: components.length,
    items: components.map(c => ({
      name: c.slug,
      command: `npx servercn add ${c.slug}`,
      frameworks: [...Object.keys(c.templates || {})],
      ...(Object.keys(c.variants || {}).length > 0 && {
        variants: [...Object.keys(c.variants || {})]
      })
    }))
  } satisfies listRegistryDataType;

  if (options?.json) {
    logger.break();
    process.stdout.write(JSON.stringify(data, null, 2));
    logger.break();
    return;
  }

  components.map((c, i) => {
    logger.log(` ${i + 1}. ${c.slug}`);
  });
  logger.break();
  logger.info(`Usage:`);
  logger.muted(` Run: npx servercn add <component-name>`);
  logger.muted(` Ex: npx servercn add email-service`);
  logger.muted(` Ex: npx servercn add async-handler jwt-utils`);
  logger.log(` Learn more: ${SERVERCN_URL}/components`);
  logger.break();
}

export async function listFoundations(options: listOptionType) {
  logger.break();
  logger.info("Available Foundations");
  const foundations = await loadRegistry("foundation");

  const data = {
    type: "foundation",
    total: foundations.length,
    items: foundations.map(c => ({
      name: c.slug,
      command: `npx servercn init ${c.slug}`,
      frameworks: [...Object.keys(c.templates || {})],
      ...(Object.keys(c.variants || {}).length > 0 && {
        variants: [...Object.keys(c.variants || {})]
      })
    }))
  } satisfies listRegistryDataType;

  if (options?.json) {
    logger.break();
    process.stdout.write(JSON.stringify(data, null, 2));
    logger.break();
    return;
  }

  foundations.map((c, i) => {
    logger.log(` ${i + 1}. ${c.slug}`);
  });
  logger.break();
  logger.info(`Usage:`);
  logger.muted(` Run: npx servercn init <foundation-name>`);
  logger.muted(` Ex: npx servercn init express-server`);
  logger.muted(` Ex: npx servercn init drizzle-mysql-starter`);
  logger.muted(` Ex: npx servercn init drizzle-pg-starter`);
  logger.muted(` Ex: npx servercn init mongoose-starter`);
  logger.log(` Learn more: ${SERVERCN_URL}/foundations`);
  logger.break();
}

export async function listTooling(options: listOptionType) {
  logger.break();
  logger.info("Available Tooling");

  const toolings = await loadRegistry("tooling");

  const data = {
    type: "tooling",
    total: toolings.length,
    items: toolings.map(c => ({
      name: c.slug,
      command: `npx servercn add tooling ${c.slug}`,
      frameworks: [...Object.keys(c.templates || {})],
      ...(Object.keys(c.variants || {}).length > 0 && {
        variants: [...Object.keys(c.variants || {})]
      })
    }))
  } satisfies listRegistryDataType;

  if (options?.json) {
    logger.break();
    process.stdout.write(JSON.stringify(data, null, 2));
    logger.break();
    return;
  }

  toolings.map((c, i) => {
    logger.log(` ${i + 1}. ${c.slug}`);
  });
  logger.break();
  logger.info(`Usage:`);
  logger.muted(` Run: npx servercn add tooling <tooling-name>`);
  logger.muted(` Ex: npx servercn add tooling commitlint`);
  logger.muted(` Ex: npx servercn add tooling prettier`);
  logger.muted(` Ex: npx servercn add tooling lint-staged`);
  logger.muted(` Ex: npx servercn add tooling eslint husky typescript `);
  logger.log(` Learn more: ${SERVERCN_URL}/docs`);
  logger.break();
}

export async function listSchemas(options: listOptionType) {
  logger.break();
  logger.info("Available Schemas");

  const schemas = await loadRegistry("schema");

  const data = {
    type: "schema",
    total: schemas.length,
    items: schemas.map(c => ({
      name: c.slug,
      command: `npx servercn add schema ${c.slug}`,
      frameworks: [...Object.keys(c.templates || {})],
      ...(Object.keys(c.templates || {}).length > 0 && {
        variants: [...Object.keys(c.templates || {})]
      })
    }))
  } satisfies listRegistryDataType;

  if (options?.json) {
    logger.break();
    process.stdout.write(JSON.stringify(data, null, 2));
    logger.break();
    return;
  }

  schemas.map((c, i) => {
    logger.log(` ${i + 1}. ${c.slug}`);
  });
  logger.break();
  logger.info(`Usage:`);
  logger.muted(` Run: npx servercn add schema <schema-name>`);
  logger.muted(` Ex: npx servercn add schema auth`);
  logger.muted(` Ex: npx servercn add schema auth/user`);
  logger.log(` Learn more: ${SERVERCN_URL}/schemas`);
  logger.break();
}

export async function listBlueprints(options: listOptionType) {
  logger.break();
  logger.info("Available Blueprints");

  const blueprints = await loadRegistry("blueprint");

  const data = {
    type: "blueprint",
    total: blueprints.length,
    items: blueprints.map(c => ({
      name: c.slug,
      command: `npx servercn add blueprint ${c.slug}`,
      frameworks: [...Object.keys(c.templates || {})],
      ...(Object.keys(c.variants || {}).length > 0 && {
        variants: [...Object.keys(c.variants || {})]
      })
    }))
  } satisfies listRegistryDataType;

  if (options?.json) {
    logger.break();
    process.stdout.write(JSON.stringify(data, null, 2));
    logger.break();
    return;
  }

  blueprints.map((c, i) => {
    logger.log(` ${i + 1}. ${c.slug}`);
  });
  logger.break();
  logger.info(`Usage:`);
  logger.muted(` Run: npx servercn add blueprint <blueprint-name>`);
  logger.muted(` Ex: npx servercn add blueprint stateless-auth`);
  logger.log(` Learn more: ${SERVERCN_URL}/blueprints`);
  logger.break();
}

export async function getRegistryLists(
  type: RegistryType,
  options?: listOptionType
) {
  switch (type) {
    case "component":
      return await listComponents(options ?? { json: false });
    case "blueprint":
      return await listBlueprints(options ?? { json: false });
    case "schema":
      return await listSchemas(options ?? { json: false });
    case "tooling":
      return listTooling(options ?? { json: false });
    case "foundation":
      return await listFoundations(options ?? { json: false });

    default:
      return await listComponents(options ?? { json: false });
  }
}
