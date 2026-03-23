import {
  ArchitectureType,
  BlueprintRegistry,
  ComponentRegistry,
  FileNode,
  FoundationRegistry,
  FrameworkType,
  GetRegistryFileTreeOptions,
  GetRegistryFileTreeResult,
  ItemType,
  RegistryFile,
  SchemaRegistry,
  ToolingRegistry
} from "@/@types/registry";

// * Shared Helpers
function getLanguageFromFileName(fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (fileName.startsWith(".env")) return "bash";
  if (fileName.startsWith("pre-commit")) return "bash";
  switch (ext) {
    case "ts":
      return "typescript";
    case "tsx":
      return "tsx";
    case "js":
      return "javascript";
    case "jsx":
      return "jsx";
    case "json":
      return "json";
    case "prisma":
      return "prisma";
    case "md":
    case "mdx":
      return "markdown";
    case "yml":
    case "yaml":
      return "yaml";
    case "env":
    case "bash":
      return "bash";
    case "html":
    case "ejs":
      return "text";
    case "css":
      return "css";
    case "sql":
      return "ts";
    default:
      return "plaintext";
  }
}

function insertFile(tree: FileNode[], file: RegistryFile) {
  const parts = file.path.split("/").filter(Boolean);
  let currentLevel = tree;

  parts.forEach((part, index) => {
    const isFile = index === parts.length - 1;

    if (isFile) {
      currentLevel.push({
        type: "file",
        name: part,
        path: file.path,
        content: file.content,
        lang: getLanguageFromFileName(part)
      });
      return;
    }

    let folder = currentLevel.find(
      node => node.type === "folder" && node.name === part
    ) as Extract<FileNode, { type: "folder" }> | undefined;

    if (!folder) {
      folder = {
        type: "folder",
        name: part,
        children: []
      };
      currentLevel.push(folder);
    }

    currentLevel = folder.children;
  });
}

function sortTree(nodes: FileNode[]): FileNode[] {
  return nodes
    .map(node =>
      node.type === "folder"
        ? { ...node, children: sortTree(node.children) }
        : node
    )
    .sort((a, b) => {
      if (a.type === "folder" && b.type === "file") return -1;
      if (a.type === "file" && b.type === "folder") return 1;
      return a.name.localeCompare(b.name);
    });
}

export function buildFileTree(files: RegistryFile[]): FileNode[] {
  const tree: FileNode[] = [];

  for (const file of files) {
    insertFile(tree, file);
  }

  return sortTree(tree);
}

export async function getRegistryJson<T = unknown>(
  slug: string,
  type: ItemType
): Promise<T> {
  const res = await fetch(`/sr/${type}/${slug}.json`);

  if (!res.ok) {
    throw new Error(`Failed to load ${type} JSON for slug: ${slug}`);
  }

  return res.json();
}

// * Component Extractor
function extractComponentFiles(
  data: ComponentRegistry,
  runtime = "node",
  framework = "express",
  architecture = "mvc",
  variant?: string
): { files: RegistryFile[]; env?: string[]; resolvedVariant?: string } {
  const frameworkNode =
    data?.runtimes?.[runtime]?.frameworks?.[framework as FrameworkType];

  if (!frameworkNode) {
    return { files: [], env: [] };
  }

  // Explicit variant
  if (variant && frameworkNode.variants?.[variant]) {
    return {
      files:
        frameworkNode.variants[variant]?.architectures?.[
          architecture as ArchitectureType
        ]?.files ?? [],
      env: frameworkNode.variants[variant]?.env ?? [],
      resolvedVariant: variant
    };
  }

  // Normal component
  const normalFiles =
    frameworkNode?.architectures?.[architecture as ArchitectureType]?.files ??
    [];
  if (normalFiles.length > 0) {
    return { files: normalFiles, env: frameworkNode?.env ?? [] };
  }

  // Default first variant
  const firstVariantKey = frameworkNode.variants
    ? Object.keys(frameworkNode.variants)[0]
    : undefined;

  if (firstVariantKey) {
    return {
      files:
        (frameworkNode?.variants &&
          frameworkNode?.variants[firstVariantKey]?.architectures?.[
            architecture as ArchitectureType
          ]?.files) ??
        [],
      env:
        (frameworkNode?.variants &&
          frameworkNode?.variants[firstVariantKey]?.env) ??
        [],
      resolvedVariant: firstVariantKey
    };
  }

  return { files: [], env: [] };
}

// * Foundation Extractor
function extractFoundationFiles(
  data: FoundationRegistry,
  runtime = "node",
  framework = "express",
  architecture = "mvc"
): { files: RegistryFile[]; env?: string[] } {
  const frameworkNode = data?.runtimes?.[runtime]?.frameworks?.[framework];

  if (!frameworkNode) {
    return { files: [], env: [] };
  }

  return {
    files: frameworkNode.architectures[architecture as ArchitectureType].files,
    env: frameworkNode?.env ?? []
  };
}

// * Tooling Extractor
function extractToolingFiles(
  data: ToolingRegistry,
  template?: string
): { files: RegistryFile[]; resolvedTemplate?: string } {
  const templates = data?.templates;

  if (!templates) {
    return { files: [] };
  }

  // Explicit template
  if (template && templates[template]) {
    return {
      files: templates[template]?.files ?? [],
      resolvedTemplate: template
    };
  }

  // Default first template
  const firstTemplateKey = Object.keys(templates)[0];

  if (firstTemplateKey) {
    return {
      files: templates[firstTemplateKey]?.files ?? [],
      resolvedTemplate: firstTemplateKey
    };
  }

  return { files: [] };
}

// * Blueprint Extractor
function extractBlueprintFiles(
  data: BlueprintRegistry,
  runtime = "node",
  framework = "express",
  architecture = "mvc",
  database?: string,
  orm?: string
): {
  files: RegistryFile[];
  resolvedDatabase?: string;
  env?: string[];
  resolvedOrm?: string;
} {
  const frameworkNode = data?.runtimes?.[runtime]?.frameworks?.[framework];

  if (!frameworkNode?.databases) {
    return { files: [], env: [] };
  }

  // Resolve database
  let resolvedDatabase = database;
  if (!resolvedDatabase || !frameworkNode.databases[resolvedDatabase]) {
    resolvedDatabase = Object.keys(frameworkNode.databases)[0];
  }

  const databaseNode = resolvedDatabase
    ? frameworkNode.databases[resolvedDatabase]
    : undefined;

  if (!databaseNode?.orms) {
    return { files: [], resolvedDatabase, env: [] };
  }

  // Resolve orm
  let resolvedOrm = orm;
  if (!resolvedOrm || !databaseNode.orms[resolvedOrm]) {
    resolvedOrm = Object.keys(databaseNode.orms)[0];
  }

  const ormNode = resolvedOrm ? databaseNode.orms[resolvedOrm] : undefined;

  if (!ormNode) {
    return { files: [], resolvedDatabase, env: [], resolvedOrm };
  }

  return {
    files: ormNode?.architectures?.[architecture]?.files ?? [],
    env: ormNode?.env ?? [],
    resolvedDatabase,
    resolvedOrm
  };
}

// * Schema Extractor
function extractSchemaFiles(
  data: SchemaRegistry,
  runtime = "node",
  framework = "express",
  architecture = "mvc",
  template?: string,
  database?: string,
  orm?: string
) {
  const frameworkNode = data?.runtimes?.[runtime]?.frameworks?.[framework];

  if (!frameworkNode?.databases) {
    return { files: [] };
  }

  // Resolve database
  let resolvedDatabase = database;
  if (!resolvedDatabase || !frameworkNode.databases[resolvedDatabase]) {
    resolvedDatabase = Object.keys(frameworkNode.databases)[0];
  }

  const databaseNode = resolvedDatabase
    ? frameworkNode.databases[resolvedDatabase]
    : undefined;

  if (!databaseNode?.orms) {
    return { files: [], resolvedDatabase };
  }

  // Resolve orm
  let resolvedOrm = orm;
  if (!resolvedOrm || !databaseNode.orms[resolvedOrm]) {
    resolvedOrm = Object.keys(databaseNode.orms)[0];
  }

  const ormNode = resolvedOrm ? databaseNode.orms[resolvedOrm] : undefined;

  if (!ormNode) {
    return {
      files: [],
      resolvedDatabase,
      resolvedOrm
    };
  }

  const templateNode = template
    ? ormNode?.templates?.[template as string]
    : ormNode?.templates?.["index"];

  return {
    files:
      (templateNode?.architectures &&
        templateNode?.architectures[architecture]?.files) ??
      [],
    resolvedDatabase,
    resolvedOrm
  };
}

// * Main Dispatcher
export async function getRegistryFileTree(
  options: GetRegistryFileTreeOptions
): Promise<GetRegistryFileTreeResult> {
  const {
    slug,
    type,
    runtime = "node",
    framework = "express",
    architecture = "mvc",
    variant,
    template,
    database,
    orm
  } = options;

  const data = await getRegistryJson(slug, type);

  switch (type) {
    case "component": {
      const result = extractComponentFiles(
        data as ComponentRegistry,
        runtime,
        framework,
        architecture,
        variant
      );

      return {
        files: result.files,
        tree: buildFileTree([
          ...result.files,
          ...[
            {
              type: "file",
              content:
                result.env
                  ?.map(e => `${e}='${e.toLowerCase()}'\n`)
                  .join("\n") || "",
              path: ".env.example"
            }
          ]
        ]),
        resolvedVariant: result.resolvedVariant
      };
    }

    case "tooling": {
      const result = extractToolingFiles(data as ToolingRegistry, template);

      return {
        files: result.files,
        tree: buildFileTree(result.files),
        resolvedTemplate: result.resolvedTemplate
      };
    }

    case "blueprint": {
      const result = extractBlueprintFiles(
        data as BlueprintRegistry,
        runtime,
        framework,
        architecture,
        database,
        orm
      );

      return {
        files: result.files,
        tree: buildFileTree([
          ...result.files,
          ...[
            {
              type: "file",
              content:
                result.env
                  ?.map(e => `${e}='${e.toLowerCase()}'\n`)
                  .join("\n") || "",
              path: ".env.example"
            }
          ]
        ]),
        resolvedDatabase: result.resolvedDatabase,
        resolvedOrm: result.resolvedOrm
      };
    }

    case "foundation":
      const result = extractFoundationFiles(
        data as FoundationRegistry,
        runtime,
        framework,
        architecture
      );
      return {
        files: {
          ...result.files,
          
          ...{
            content:
              (result?.env &&
                result?.env?.length > 0 &&
                result.env?.map(e => `${e}='${e.toLowerCase()}'`).join("\n")) ||
              "",

            type: "file",
            name: ".env.example",
            path: ".env.example"
          }
        },
        tree: buildFileTree([
          ...result.files,
          ...[
            {
              type: "file",
              content:
                (result?.env &&
                  result?.env?.length > 0 &&
                  result.env
                    ?.map(e => `${e}='${e.toLowerCase()}'`)
                    .join("\n")) ||
                "",
              path: ".env.example"
            }
          ]
        ])
      };

    case "schema": {
      const result = extractSchemaFiles(
        data as SchemaRegistry,
        runtime,
        framework,
        architecture,
        template,
        database,
        orm
      );
      return {
        files: result.files,
        tree: buildFileTree(result.files),
        resolvedDatabase: result.resolvedDatabase,
        resolvedOrm: result.resolvedOrm
      };
    }
    default: {
      return {
        files: [],
        tree: []
      };
    }
  }
}
