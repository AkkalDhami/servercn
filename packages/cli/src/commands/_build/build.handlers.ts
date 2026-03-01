/* eslint-disable @typescript-eslint/no-explicit-any */
import path from "node:path"
import fs from "fs-extra"
import { glob } from "glob"
import { paths } from "@/lib/paths"
import type {
    RegistryType,
    RegistryComponent,
    RegistryBlueprint,
    RegistryFoundation,
    RegistrySchema,
    RegistryTooling,
    ArchitectureSet,
    NodeRuntime,
    FrameworkConfig
} from "@/types"
import { logger } from "@/utils/logger"

export async function processRegistryItem(item: any, type: RegistryType) {
    switch (type) {
        case "component":
            return await buildComponent(item as RegistryComponent);
        case "blueprint":
            return await buildBlueprint(item as RegistryBlueprint);
        case "foundation":
            return await buildFoundation(item as RegistryFoundation);
        case "schema":
            return await buildSchema(item as RegistrySchema);
        case "tooling":
            return await buildTooling(item as RegistryTooling);
        default:
            throw new Error(`Unsupported registry type: ${type}`);
    }
}

async function buildComponent(component: RegistryComponent) {
    const built: any = { ...component, runtimes: {} };
    delete built["$schema"];
    for (const [runtimeKey, runtime] of Object.entries(component.runtimes)) {
        const rt = runtime as NodeRuntime;
        built.runtimes[runtimeKey] = { frameworks: {} };
        for (const [frameworkKey, framework] of Object.entries(rt.frameworks)) {
            const fw = framework as FrameworkConfig;
            if ("variants" in fw && fw.variants) {
                // Variant-based framework
                const builtVariants: any = {};
                for (const [variantKey, variant] of Object.entries(fw.variants)) {
                    const v = variant;
                    builtVariants[variantKey] = {
                        ...v,
                        architectures: await processArchitectureSet(
                            v.templates,
                            path.join(runtimeKey, frameworkKey, "component")
                        )
                    };
                    delete builtVariants[variantKey].templates;
                }
                built.runtimes[runtimeKey].frameworks[frameworkKey] = {
                    prompt: fw.prompt,
                    variants: builtVariants
                };
            } else if ("templates" in fw && fw.templates) {
                // Simple framework
                built.runtimes[runtimeKey].frameworks[frameworkKey] = {
                    ...fw,
                    architectures: await processArchitectureSet(
                        fw.templates,
                        path.join(runtimeKey, frameworkKey, "component")
                    )
                };
                delete (built.runtimes[runtimeKey].frameworks[frameworkKey] as any).templates;
            }
        }
    }
    return built;
}

async function buildFoundation(foundation: RegistryFoundation) {
    const built: any = { ...foundation, runtimes: {} };
    delete built["$schema"];
    for (const [runtimeKey, runtime] of Object.entries(foundation.runtimes)) {
        built.runtimes[runtimeKey] = { frameworks: {} };
        for (const [frameworkKey, framework] of Object.entries(runtime.frameworks)) {
            if (framework) {
                built.runtimes[runtimeKey].frameworks[frameworkKey] = {
                    ...framework,
                    architectures: await processArchitectureSet(
                        framework?.templates,
                        path.join(runtimeKey, frameworkKey, "foundation")
                    )
                };
                delete (built.runtimes[runtimeKey].frameworks[frameworkKey] as any).templates;
            }
        }
    }
    return built;
}

async function buildBlueprint(blueprint: RegistryBlueprint) {
    const built: any = { ...blueprint, runtimes: {} };
    delete built["$schema"];
    for (const [runtimeKey, runtime] of Object.entries(blueprint.runtimes)) {
        built.runtimes[runtimeKey] = { frameworks: {} };
        for (const [frameworkKey, framework] of Object.entries(runtime.frameworks)) {
            const builtDatabases: any = {};
            for (const [dbKey, db] of Object.entries(framework.databases)) {
                const builtOrms: any = {};
                for (const [ormKey, orm] of Object.entries(db.orms)) {
                    builtOrms[ormKey] = {
                        ...orm,
                        architectures: await processArchitectureSet(
                            orm.templates,
                            path.join(runtimeKey, frameworkKey, "blueprint")
                        )
                    };
                    delete (builtOrms[ormKey] as any).templates;
                }
                builtDatabases[dbKey] = { orms: builtOrms };
            }
            built.runtimes[runtimeKey].frameworks[frameworkKey] = { databases: builtDatabases };
        }
    }
    return built;
}

async function buildSchema(schema: RegistrySchema) {
    const built: any = { ...schema, runtimes: {} };
    delete built["$schema"];
    for (const [runtimeKey, runtime] of Object.entries(schema.runtimes)) {
        built.runtimes[runtimeKey] = { frameworks: {} };
        for (const [frameworkKey, framework] of Object.entries(runtime.frameworks)) {
            const builtDatabases: any = {};
            for (const [dbKey, db] of Object.entries(framework.databases)) {
                const builtOrms: any = {};
                for (const [ormKey, orm] of Object.entries(db.orms)) {
                    const builtMultiTemplates: any = {};
                    for (const [tmplKey, archSet] of Object.entries(orm.templates)) {
                        builtMultiTemplates[tmplKey] = {
                            architectures: await processArchitectureSet(
                                archSet,
                                path.join(runtimeKey, frameworkKey, "schema")
                            )
                        };
                    }
                    builtOrms[ormKey] = {
                        ...orm,
                        templates: builtMultiTemplates
                    };
                }
                builtDatabases[dbKey] = { orms: builtOrms };
            }
            built.runtimes[runtimeKey].frameworks[frameworkKey] = { databases: builtDatabases };
        }
    }
    return built;
}

async function buildTooling(tooling: RegistryTooling) {
    const built: any = { ...tooling };
    delete built["$schema"];
    const builtTemplates: any = {};
    for (const [tmplKey, tmplPath] of Object.entries(tooling.templates)) {
        const absolutePath = path.join(paths.templateBase, "tooling", tmplPath);
        builtTemplates[tmplKey] = {
            files: await extractFiles(absolutePath, "tooling")
        };
    }
    built.templates = builtTemplates;
    return built;
}

async function processArchitectureSet(archSet: ArchitectureSet, baseRelPath: string) {
    const architectures: any = {};
    for (const [archKey, relTemplatePath] of Object.entries(archSet)) {
        if (!relTemplatePath) continue;
        const absoluteTemplatePath = path.join(paths.templateBase, baseRelPath, relTemplatePath);
        architectures[archKey] = {
            files: await extractFiles(absoluteTemplatePath, "file")
        };
    }
    return architectures;
}

export async function extractFiles(templateDir: string, type: string) {
    if (!(await fs.pathExists(templateDir))) {
        logger.warn(`Template directory not found: ${templateDir}`);
        return [];
    }

    const pattern = "**/*";
    const filePaths = await glob(pattern, {
        cwd: templateDir,
        nodir: true,
        dot: true
    });

    const files = [];

    for (const relativePath of filePaths) {
        const absolutePath = path.join(templateDir, relativePath);
        const content = await fs.readFile(absolutePath, "utf8");

        files.push({
            type,
            path: normalizePath(relativePath),
            content
        });
    }

    return files;
}

function normalizePath(p: string) {
    return p.split(path.sep).join("/");
}