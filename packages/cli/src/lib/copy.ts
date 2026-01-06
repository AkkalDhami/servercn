import fs from "fs-extra";
import path from "path";
import { logger } from "../utils/cli-logger";
import { CopyOptions, NamingConventions } from "../types";

export type ConflictStrategy = "skip" | "overwrite" | "error";



function toKebabCase(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

function toCamelCase(value: string) {
  return value
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^(.)/, (m) => m.toLowerCase());
}

function toPascalCase(value: string) {
  const camel = toCamelCase(value);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

function toSnakeCase(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[\s-]+/g, "_")
    .toLowerCase();
}

function applyNaming(value: string, style?: NamingConventions["fileNaming"]) {
  switch (style) {
    case "camel-case":
      return toCamelCase(value);
    case "snake-case":
      return toSnakeCase(value);
    case "kebab-case":
    default:
      return toKebabCase(value);
  }
}

function applyFunctionNaming(
  value: string,
  style?: NamingConventions["functionNaming"]
) {
  switch (style) {
    case "pascal-case":
      return toPascalCase(value);
    case "snake-case":
      return toSnakeCase(value);
    case "camel-case":
    default:
      return toCamelCase(value);
  }
}

export async function copyTemplate({
  templateDir,
  targetDir,
  componentName,
  conventions,
  replacements = {},
  conflict = "skip",
  dryRun = false,
}: CopyOptions) {
  if (!(await fs.pathExists(templateDir))) {
    logger.error(`Template not found: ${templateDir}`);
    return;
  }

  await fs.ensureDir(targetDir);

  const entries = await fs.readdir(templateDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(templateDir, entry.name);

    /**
     * -----------------------------------------
     * Filename handling
     * -----------------------------------------
     */
    let rawName = entry.name === "_gitignore" ? ".gitignore" : entry.name;

    let finalName = rawName;

    if (componentName && rawName.includes("component")) {
      const baseName = applyNaming(componentName, conventions.fileNaming);

      finalName = rawName.replace("component", baseName);
    }

    const destPath = path.join(targetDir, finalName);

    /**
     * -----------------------------------------
     * Directory recursion
     * -----------------------------------------
     */
    if (entry.isDirectory()) {
      await copyTemplate({
        templateDir: srcPath,
        targetDir: destPath,
        componentName,
        conventions,
        replacements,
        conflict,
        dryRun,
      });
      continue;
    }

    const exists = await fs.pathExists(destPath);

    if (exists) {
      if (conflict === "skip") {
        logger.warn(`Skipped: ${destPath}`);
        continue;
      }
      if (conflict === "error") {
        throw new Error(`File already exists: ${destPath}`);
      }
    }

    if (dryRun) {
      logger.info(`[dry-run] ${exists ? "Overwrite" : "Create"}: ${destPath}`);
      continue;
    }

    const buffer = await fs.readFile(srcPath);
    const isBinary = buffer.includes(0);

    await fs.ensureDir(path.dirname(destPath));

    if (isBinary) {
      await fs.copyFile(srcPath, destPath);
    } else {
      let content = buffer.toString("utf8");

      /**
       * -----------------------------------------
       * Default replacements
       * -----------------------------------------
       */
      if (componentName) {
        const fileName = applyNaming(componentName, conventions.fileNaming);

        const functionName = applyFunctionNaming(
          componentName,
          conventions.functionNaming
        );

        content = content
          .replaceAll("{{fileName}}", fileName)
          .replaceAll("{{FILE_NAME}}", fileName.toUpperCase())
          .replaceAll("{{functionName}}", functionName)
          .replaceAll("{{FUNCTION_NAME}}", functionName.toUpperCase());
      }

      /**
       * -----------------------------------------
       * Custom replacements
       * -----------------------------------------
       */
      for (const [key, value] of Object.entries(replacements)) {
        content = content.replaceAll(`{{${key}}}`, value);
      }

      await fs.writeFile(destPath, content);
    }

    logger.success(
      exists ? `Overwritten: ${destPath}` : `Created: ${destPath}`
    );
  }
}
