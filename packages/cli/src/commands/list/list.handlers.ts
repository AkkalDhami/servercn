import { SERVERCN_URL } from "@/constants/app.constants";
import { loadRegistryItems } from "@/lib/registry-list";

import type { RegistryData, RegistryType } from "@/types";
import { highlighter } from "@/utils/highlighter";
import { logger } from "@/utils/logger";

import Table from "cli-table3";

export type listOptionType = {
  json?: boolean;
  all?: boolean;
  local?: boolean;
};

type listOverviewType = {
  command: string;
  types: {
    type: RegistryType;
    alias: "cp" | "bp" | "tl" | "sc" | "fd" | "pr";
    total: number;
    command: string;
  }[];
  docs?: string;
};

export async function listOverview(options: listOptionType) {
  const components = await loadRegistryItems("component", options.local);
  const blueprints = await loadRegistryItems("blueprint", options.local);
  const foundations = await loadRegistryItems("foundation", options.local);
  const providers = await loadRegistryItems("provider", options.local);
  const toolings = await loadRegistryItems("tooling", options.local);
  const schemas = await loadRegistryItems("schema", options.local);

  if (options.all) {
    return await getRegistryLists("blueprint", options);
  }

  const data: listOverviewType = {
    command: "npx servercn-cli list <type>",
    types: [
      {
        type: "component",
        alias: "cp",
        total: components.length,
        command: "npx servercn-cli list cp"
      },
      {
        type: "blueprint",
        alias: "bp",
        total: blueprints.length,
        command: "npx servercn-cli list bp"
      },
      {
        type: "foundation",
        alias: "fd",
        total: foundations.length,
        command: "npx servercn-cli list fd"
      },
      {
        type: "provider",
        alias: "pr",
        total: providers.length,
        command: "npx servercn-cli list pr"
      },
      {
        type: "tooling",
        alias: "tl",
        total: toolings.length,
        command: "npx servercn-cli list tl"
      },
      {
        type: "schema",
        alias: "sc",
        total: schemas.length,
        command: "npx servercn-cli list sc"
      }
    ],
    docs: ` ${SERVERCN_URL}/docs/cli`
  };

  const table = new Table({
    head: [
      highlighter.error("type"),
      highlighter.error("total"),
      highlighter.error("alias"),
      highlighter.error("command")
    ],
    colWidths: [12, 8, 8, 28]
  });
  data.types.forEach(type => {
    table.push([
      highlighter.create(type.type),
      type.total,
      highlighter.warn(type.alias),
      highlighter.info(type.command)
    ]);
  });

  if (options?.json) {
    logger.break();
    process.stdout.write(JSON.stringify(data, null, 2));
    logger.break();
    return;
  }
  logger.break();
  logger.log(table.toString());
  logger.log(`
 ${highlighter.create("Explore:")}
 npx servercn-cli ls <type | alias>
 npx servercn-cli ls <type | alias> --json

 ${highlighter.create("Examples:")}
 npx servercn-cli ls component
 npx servercn-cli ls cp
 npx servercn-cli ls foundation
 npx servercn-cli ls fd --json
 npx servercn-cli ls schema
 npx servercn-cli ls sc --json
 npx servercn-cli ls pr --json
`);
  logger.info(`Learn more: ${SERVERCN_URL}/docs/cli`);
  logger.break();
}

type listRegistryDataType = {
  type: RegistryType;
  command: string;
  total: number;
  alias?: "cp" | "bp" | "fd" | "tl" | "sc";
  items: {
    name: string;
    command: string;
    frameworks?: string[];
  }[];
  docs?: string[];
};

export async function listComponents(options: listOptionType) {
  const components: RegistryData[] = await loadRegistryItems(
    "component",
    options.local
  );
  const data = {
    type: "component",
    command: `npx servercn-cli add <component-name>`,
    total: components.length,
    items: components.map(c => ({
      name: c.slug,
      command: `npx servercn-cli add ${c.slug}`,
      ...(c?.frameworks &&
        c.frameworks.length > 0 && { framework: c.frameworks })
    })),
    docs: [`${SERVERCN_URL}/components`, `${SERVERCN_URL}/docs/cli#ls-cp`]
  } satisfies listRegistryDataType;

  if (options?.json) {
    process.stdout.write(JSON.stringify(data, null, 2));
    logger.break();
    return;
  }

  const table = new Table({
    head: [
      highlighter.create("s.no"),
      highlighter.create("name"),
      highlighter.create("command"),
      highlighter.create("frameworks")
    ],
    colWidths: [6, 26, 46, 26]
  });
  logger.break();
  logger.log(highlighter.create("Available Component"));
  components.map((c, i) => {
    table.push([
      i + 1,
      c.slug,
      `npx servercn-cli add ${c.slug}`,
      (c?.frameworks && c.frameworks.join(", ")) || ""
    ]);
  });
  logger.log(table.toString());
  logger.break();
  logger.info(`Learn more: ${SERVERCN_URL}/components`);
  logger.break();
  logger.info(`Visit docs: ${SERVERCN_URL}/docs/cli#ls-cp`);
  logger.break();
}

export async function listFoundations(options: listOptionType) {
  const foundations = await loadRegistryItems("foundation", options.local);

  const data = {
    type: "foundation",
    command: `npx servercn-cli init <foundation-name>`,
    total: foundations.length,
    items: foundations
      .sort((a, b) => a.slug.localeCompare(b.slug))
      .map(c => ({
        name: c.slug,
        command: `npx servercn-cli init ${c.slug}`,
        ...(c?.frameworks &&
          c.frameworks.length > 0 && { frameworks: c.frameworks })
      })),
    docs: [`${SERVERCN_URL}/foundations`, `${SERVERCN_URL}/docs/cli#ls-fd`]
  } satisfies listRegistryDataType;

  if (options?.json) {
    process.stdout.write(JSON.stringify(data, null, 2));
    logger.break();
    return;
  }

  const table = new Table({
    head: [
      highlighter.create("s.no"),
      highlighter.create("name"),
      highlighter.create("command"),
      highlighter.create("frameworks")
    ],
    colWidths: [6, 26, 46, 26]
  });

  logger.break();
  logger.log(highlighter.create("Available Foundation"));
  foundations.map((c, i) => {
    table.push([
      i + 1,
      c.slug,
      `npx servercn-cli init ${c.slug}`,
      (c?.frameworks && c.frameworks.join(", ")) || ""
    ]);
  });
  logger.log(table.toString());
  logger.break();
  logger.info(`Learn more: ${SERVERCN_URL}/foundations`);
  logger.break();
  logger.info(`Visit docs: ${SERVERCN_URL}/docs/cli#ls-fd`);
  logger.break();
}

export async function listProviders(options: listOptionType) {
  const foundations = await loadRegistryItems("provider", options.local);

  const data = {
    type: "provider",
    command: `npx servercn-cli add pr <provider-name>`,
    total: foundations.length,
    items: foundations
      .sort((a, b) => a.slug.localeCompare(b.slug))
      .map(c => ({
        name: c.slug,
        command: `npx servercn-cli add pr ${c.slug}`,
        ...(c?.frameworks &&
          c.frameworks.length > 0 && { frameworks: c.frameworks })
      })),
    docs: [`${SERVERCN_URL}/providers`, `${SERVERCN_URL}/docs/cli#ls-pr`]
  } satisfies listRegistryDataType;

  if (options?.json) {
    process.stdout.write(JSON.stringify(data, null, 2));
    logger.break();
    return;
  }

  const table = new Table({
    head: [
      highlighter.create("s.no"),
      highlighter.create("name"),
      highlighter.create("command"),
      highlighter.create("frameworks")
    ],
    colWidths: [6, 26, 46, 26]
  });

  logger.break();
  logger.log(highlighter.create("Available Provider"));
  foundations.map((c, i) => {
    table.push([
      i + 1,
      c.slug,
      `npx servercn-cli add pr ${c.slug}`,
      (c?.frameworks && c.frameworks.join(", ")) || ""
    ]);
  });
  logger.log(table.toString());
  logger.break();
  logger.info(`Learn more: ${SERVERCN_URL}/providers`);
  logger.break();
  logger.info(`Visit docs: ${SERVERCN_URL}/docs/cli#ls-pr`);
  logger.break();
}

export async function listTooling(options: listOptionType) {
  const toolings = await loadRegistryItems("tooling", options.local);

  const data = {
    type: "tooling",
    alias: "tl",
    command: `npx servercn-cli add tooling <tooling-name>`,
    total: toolings.length,
    items: toolings.map(c => ({
      name: c.slug,
      command: `npx servercn-cli add tl ${c.slug}`
    })),
    docs: [`${SERVERCN_URL}/docs`, `${SERVERCN_URL}/docs/cli#ls-tl`]
  } satisfies listRegistryDataType;

  if (options?.json) {
    process.stdout.write(JSON.stringify(data, null, 2));
    logger.break();
    return;
  }

  const table = new Table({
    head: [
      highlighter.create("s.no"),
      highlighter.create("name"),
      highlighter.create("command")
    ],
    colWidths: [6, 26, 46]
  });

  logger.break();
  logger.log(highlighter.create("Available Tooling"));
  toolings.map((c, i) => {
    table.push([i + 1, c.slug, `npx servercn-cli add tl ${c.slug}`]);
  });
  logger.log(table.toString());
  logger.break();
  logger.info(`Learn more: ${SERVERCN_URL}/docs`);
  logger.break();
  logger.info(`Visit docs: ${SERVERCN_URL}/docs/cli#ls-tl`);
  logger.break();
}

export async function listSchemas(options: listOptionType) {
  const schemas = await loadRegistryItems("schema", options.local);

  const data = {
    type: "schema",
    alias: "sc",
    command: `npx servercn-cli add schema <schema-name>`,
    total: schemas.length,
    items: schemas
      .sort((a, b) => a.slug.localeCompare(b.slug))
      .map(c => ({
        name: c.slug,
        command: `npx servercn-cli add sc ${c.slug}`,
        ...(c?.frameworks &&
          c.frameworks.length > 0 && { frameworks: c.frameworks })
      })),
    docs: [`${SERVERCN_URL}/schemas`, `${SERVERCN_URL}/docs/cli#ls-sc`]
  } satisfies listRegistryDataType;

  if (options?.json) {
    process.stdout.write(JSON.stringify(data, null, 2));
    logger.break();
    return;
  }

  const table = new Table({
    head: [
      highlighter.create("s.no"),
      highlighter.create("name"),
      highlighter.create("command"),
      highlighter.create("frameworks")
    ],
    colWidths: [6, 26, 46, 26]
  });

  logger.break();
  logger.log(highlighter.create("Available Schemas"));
  schemas.map((c, i) => {
    table.push([
      i + 1,
      c.slug,
      `npx servercn-cli add sc ${c.slug}`,
      (c?.frameworks && c.frameworks.join(", ")) || ""
    ]);
  });
  logger.log(table.toString());

  logger.break();
  logger.info(`Learn more: ${SERVERCN_URL}/schemas`);
  logger.break();
  logger.info(`Visit docs: ${SERVERCN_URL}/docs/cli#ls-sc`);
  logger.break();
}

export async function listBlueprints(options: listOptionType) {
  const blueprints = await loadRegistryItems("blueprint", options.local);
  const data = {
    type: "blueprint",
    alias: "bp",
    command: `npx servercn-cli add blueprint <blueprint-name>`,
    total: blueprints.length,
    items: blueprints.map(c => ({
      name: c.slug,
      command: `npx servercn-cli add bp ${c.slug}`,
      ...(c?.frameworks &&
        c.frameworks.length > 0 && { frameworks: c.frameworks })
    })),
    docs: [`${SERVERCN_URL}/blueprints`, `${SERVERCN_URL}/docs/cli#ls-bp`]
  } satisfies listRegistryDataType;

  if (options?.json) {
    process.stdout.write(JSON.stringify(data, null, 2));
    logger.break();
    return;
  }

  const table = new Table({
    head: [
      highlighter.create("s.no"),
      highlighter.create("name"),
      highlighter.create("command"),
      highlighter.create("frameworks")
    ],
    colWidths: [6, 26, 46, 26]
  });

  logger.break();
  logger.log(highlighter.create("Available Blueprints"));
  blueprints.map((c, i) => {
    table.push([
      i + 1,
      c.slug,
      `npx servercn-cli add bp ${c.slug}`,
      (c?.frameworks && c.frameworks.join(", ")) || ""
    ]);
  });
  logger.log(table.toString());
  logger.break();
  logger.info(`Learn more: ${SERVERCN_URL}/blueprints`);
  logger.break();
  logger.info(`Visit docs: ${SERVERCN_URL}/docs/cli#ls-bp`);
  logger.break();
}

export async function getRegistryLists(
  type: RegistryType,
  options?: listOptionType
) {
  if (options?.all && options.json) {
    await listComponents({ json: true, local: options.local });
    await listSchemas({ json: true, local: options.local });
    await listBlueprints({ json: true, local: options.local });
    await listTooling({ json: true, local: options.local });
    await listFoundations({ json: true, local: options.local });
    await listProviders({ json: true, local: options.local });
  } else if (options?.all) {
    await listComponents({ json: false, local: options.local });
    await listSchemas({ json: false, local: options.local });
    await listBlueprints({ json: false, local: options.local });
    await listTooling({ json: false, local: options.local });
    await listFoundations({ json: false, local: options.local });
    await listProviders({ json: false, local: options.local });
  } else {
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
      case "provider":
        return await listProviders(options ?? { json: false });

      default:
        return await listComponents(options ?? { json: false });
    }
  }
}
