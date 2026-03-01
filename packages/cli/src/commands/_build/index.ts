/* eslint-disable @typescript-eslint/no-explicit-any */
import path from "node:path";
import fs from "fs-extra";
import { glob } from "glob";
import { processRegistryItem } from "./build.handlers";
import {
  APP_NAME,
  RegistryTypeList,
  SERVERCN_URL
} from "@/constants/app.constants";
import type { RegistryType, RegistryItem, FrameworkType } from "@/types";
import { paths } from "@/lib/paths";
import { logger } from "@/utils/logger";
import { spinner } from "@/utils/spinner";
import { highlighter } from "@/utils/highlighter";

export type buildTypeProps = {
  url?: string;
  name?: string;
};

export async function build(options: buildTypeProps) {
  const buildSpin = spinner("Building ServerCN registry...").start();

  const index: {
    name: string;
    homepage: string;
    items: {
      type: string;
      slug: string;
      frameworks?: Array<FrameworkType>;
    }[];
  } = {
    name: options.name ?? APP_NAME.toLowerCase(),
    homepage: options.url ?? SERVERCN_URL,
    items: []
  };

  let totalItems = 0;
  let builtItems = 0;
  let updatedItems = 0;
  let skippedItems = 0;

  for (const type of RegistryTypeList) {
    // buildSpin.text = `Processing type: ${type}`;
    const sourceDir = path.join(paths.registryBase, type as string);
    const targetDir = path.join(paths.outputBase, type as string);

    if (!(await fs.pathExists(sourceDir))) {
      continue;
    }

    await fs.ensureDir(targetDir);

    const files = await glob("*.json", { cwd: sourceDir });
    for (const file of files) {
      totalItems++;
      const sourcePath = path.join(sourceDir, file);
      const item = (await fs.readJson(sourcePath)) as any;
      const outputPath = path.join(targetDir, `${item.slug}.json`);
      const buildStatus = await getBuildStatus(
        sourcePath,
        outputPath,
        item,
        type as RegistryType
      );

      if (buildStatus === "skip") {
        skippedItems++;

        if (type === "tooling" || !item.runtimes?.["node"]?.frameworks) {
          index.items.push({
            type: type,
            slug: item.slug
          });
        } else {
          index.items.push({
            type: type,
            slug: item.slug,
            frameworks: Object.keys(
              item.runtimes["node"].frameworks
            ) as Array<FrameworkType>
          });
        }
        continue;
      }

      buildSpin.text = `${buildStatus === "rebuild" ? "Building" : "Updating"} ${type}: ${item.slug}`;
      try {
        const builtItem = await processRegistryItem(item, type as RegistryType);
        await fs.writeJson(outputPath, builtItem, { spaces: 2 });

        if (type === "tooling" || !builtItem.runtimes?.["node"]?.frameworks) {
          index.items.push({
            type: type,
            slug: item.slug
          });
        } else {
          index.items.push({
            type: type,
            slug: item.slug,
            frameworks: Object.keys(
              builtItem.runtimes["node"].frameworks
            ) as Array<FrameworkType>
          });
        }

        if (buildStatus === "rebuild") {
          builtItems++;
        } else {
          updatedItems++;
        }
      } catch (error) {
        console.error(error);
        buildSpin.fail(`Failed to build ${item.slug}`);
        logger.error(error);
        buildSpin.start("Resuming build...");
      }
    }
  }

  await fs.writeJson(path.join(paths.outputBase, "index.json"), index, {
    spaces: 2
  });

  buildSpin.succeed(
    `${highlighter.success("Registry build completed")}\nTotal: ${totalItems}, Built: ${builtItems}, Updated: ${updatedItems}, Skipped: ${skippedItems}`
  );
}

async function getBuildStatus(
  sourcePath: string,
  outputPath: string,
  item: RegistryItem,
  type: RegistryType
): Promise<"rebuild" | "update" | "skip"> {
  if (!(await fs.pathExists(outputPath))) return "rebuild";

  const sourceStat = await fs.stat(sourcePath);
  const targetStat = await fs.stat(outputPath);

  // Check templates first - if any template is newer than the output, we MUST rebuild
  const templatePaths = getTemplatePathsForItem(item, type);
  for (const tp of templatePaths) {
    const absoluteTp = path.join(paths.templateBase, tp);
    if (!(await fs.pathExists(absoluteTp))) continue;

    const tpStat = await fs.stat(absoluteTp);
    if (tpStat.isDirectory()) {
      const files = await glob("**/*", {
        cwd: absoluteTp,
        nodir: true,
        absolute: true
      });
      for (const f of files) {
        const fStat = await fs.stat(f);
        if (fStat.mtime > targetStat.mtime) return "rebuild";
      }
    } else {
      if (tpStat.mtime > targetStat.mtime) return "rebuild";
    }
  }

  // If templates are up to date, check if the registry JSON itself changed
  if (sourceStat.mtime > targetStat.mtime) return "update";

  return "skip";
}

function getTemplatePathsForItem(
  item: RegistryItem,
  type: RegistryType
): string[] {
  const templatePaths: string[] = [];
  const itemAny = item as any;

  if (type === "tooling") {
    if (itemAny.templates) {
      for (const tPath of Object.values(itemAny.templates)) {
        templatePaths.push(path.join("tooling", tPath as string));
      }
    }
    return templatePaths;
  }

  if (!itemAny.runtimes) return templatePaths;

  for (const [runtimeKey, runtime] of Object.entries<any>(itemAny.runtimes)) {
    for (const [frameworkKey, framework] of Object.entries<any>(
      runtime.frameworks
    )) {
      const baseRelPath = path.join(runtimeKey, frameworkKey, type);

      if (framework.variants) {
        for (const variant of Object.values<any>(framework.variants)) {
          if (variant.templates) {
            for (const tPath of Object.values(variant.templates)) {
              templatePaths.push(path.join(baseRelPath, tPath as string));
            }
          }
        }
      } else if (framework.templates) {
        for (const tPath of Object.values<any>(framework.templates)) {
          if (typeof tPath === "string") {
            templatePaths.push(path.join(baseRelPath, tPath));
          } else if (typeof tPath === "object" && tPath !== null) {
            // For blueprints/schemas where templates might be Record<string, ArchitectureSet>
            for (const archSet of Object.values<any>(tPath)) {
              if (typeof archSet === "string") {
                templatePaths.push(path.join(baseRelPath, archSet));
              } else if (typeof archSet === "object" && archSet !== null) {
                for (const p of Object.values(archSet)) {
                  templatePaths.push(path.join(baseRelPath, p as string));
                }
              }
            }
          }
        }
      } else if (framework.databases) {
        // Blueprint/Schema
        for (const db of Object.values<any>(framework.databases)) {
          for (const orm of Object.values<any>(db.orms)) {
            if (orm.templates) {
              for (const val of Object.values<any>(orm.templates)) {
                if (typeof val === "string") {
                  templatePaths.push(path.join(baseRelPath, val));
                } else if (typeof val === "object" && val !== null) {
                  // Schema multi-templates
                  for (const p of Object.values(val)) {
                    templatePaths.push(path.join(baseRelPath, p as string));
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return templatePaths;
}
