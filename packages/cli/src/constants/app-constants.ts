export const SERVERCN_CONFIG_FILE = "servercn.config.json" as const;

export const PackageManagerList = ["pnpm", "yarn", "npm", "bun"] as const;

export const ArchitectureList = ["mvc", "feature"] as const;

export const DatabaseList = ["mongodb", "postgresql", "mysql"] as const;

export const OrmLists = ["mongoose", "drizzle", "prisma"] as const;

export const RegistryTypeList = [
  "component",
  "blueprint",
  "guide",
  "schema",
  "foundation",
  "tooling"
] as const;
