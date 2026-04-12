import fs from "fs-extra";
import path from "node:path";

import type {
  Architecture,
  DatabaseType,
  FrameworkType,
  OrmType,
  RegistryItem
} from "@/types";
import { logger } from "./logger";
import { highlighter } from "./highlighter";

/**
 * Extracts files from a built registry item based on the template path.
 * The templatePath used in the handlers is runtime/framework/type/subpath.
 */
export function findFilesByPath(
  component: RegistryItem,
  templatePath: string,
  selectedProvider?: string
):
  | {
      type: string;
      path: string;
      content: string;
    }[]
  | null {
  const parts = templatePath.split("/");
  const [type] = parts;
  if (type === "tooling" && "templates" in component) {
    // For tooling, built JSON has templates[key].files
    const templates = component.templates as unknown as Record<
      string,
      { files: { type: string; path: string; content: string }[] }
    >;
    for (const tmpl of Object.values(templates || {})) {
      if (tmpl.files) return tmpl.files;
    }
    return null;
  } else {
    const [runtime, framework, type] = parts;
    const archKey = parts[parts.length - 1];
    if (!("runtimes" in component)) return null;

    const runtimes = component.runtimes as unknown as Record<
      string,
      {
        frameworks: Record<
          FrameworkType,
          {
            architectures?: Record<
              Architecture,
              { files: { type: string; path: string; content: string }[] }
            >;
            variants?: Record<
              string,
              {
                architectures: Record<
                  Architecture,
                  { files: { type: string; path: string; content: string }[] }
                >;
              }
            >;
            databases?: Record<
              DatabaseType,
              {
                orms: Record<
                  OrmType,
                  {
                    templates?: Record<
                      string,
                      {
                        architectures: Record<
                          Architecture,
                          {
                            files: {
                              type: string;
                              path: string;
                              content: string;
                            }[];
                          }
                        >;
                      }
                    >;
                    architectures?: Record<
                      Architecture,
                      {
                        files: {
                          type: string;
                          path: string;
                          content: string;
                        }[];
                      }
                    >;
                  }
                >;
              }
            >;
          }
        >;
      }
    >;
    const fw = runtimes[runtime]?.frameworks?.[framework as FrameworkType];
    if (!fw) return null;

    // 1. Check direct architectures (Foundation/Simple component)
    if (fw.architectures && fw.architectures[archKey as Architecture]) {
      return fw.architectures[archKey as Architecture].files;
    }

    // 2. Check variants (Variant component)
    if (fw.variants && selectedProvider !== undefined) {
      return fw?.variants[selectedProvider as string]?.architectures[
        archKey as Architecture
      ].files;
    }

    // 3. Check databases/ORMs (Blueprint/Schema)
    if (fw.databases) {
      if (type === "blueprint") {
        const [, , , db, orm, arch] = parts;
        const database = fw.databases?.[db as DatabaseType];
        if (!database) return null;
        const ormConfig = database.orms?.[orm as OrmType];
        if (!ormConfig || !ormConfig.architectures) return null;

        const architecture = ormConfig.architectures?.[arch as Architecture];
        if (!architecture) return null;
        return architecture.files ?? null;
      } else if (type === "schema") {
        const [, , , db, orm, variant, arch] = parts;
        const database = fw.databases?.[db as DatabaseType];
        if (!database) return null;

        const ormConfig = database.orms?.[orm as OrmType];
        if (!ormConfig || !ormConfig.templates) return null;

        const template = ormConfig.templates?.[variant];
        if (!template) return null;

        const architecture = template.architectures?.[arch as Architecture];
        if (!architecture) return null;

        return architecture.files ?? null;
      }
    }

    return null;
  }
}

function formatPath(filePath: string) {
  return path.relative(process.cwd(), filePath);
}

/**
 * Write file safely
 * @param filePath
 * @param content
 */

export async function writeFileSafe({
  filePath,
  content,
  force
}: {
  filePath: string;
  content: string;
  force?: boolean;
}) {
  const exists = await fs.pathExists(filePath);
  const displayPath = formatPath(filePath);

  if (exists && !force) {
    logger.log(`${highlighter.warn("File already exists:")} ${displayPath}`);
    logger.info(`Use --force to overwrite\n`);
    process.exit(1);
  }

  await fs.outputFile(filePath, content);

  if (force) {
    logger.overwrite(`${displayPath}`);
  } else {
    logger.create(`${displayPath}`);
  }
}
/**
 * Resolve path
 * @param paths
 * @returns
 */

export function resolvePath(...paths: string[]) {
  return path.join(process.cwd(), ...paths);
}
