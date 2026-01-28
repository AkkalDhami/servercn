export const SERVERCN_CONFIG_FILE = "servercn.config.json" as const;

export const RuntimeList = ["node"] as const;

export const FrameworkList = ["express"] as const;

export const LanguageList = ["typescript"] as const;

export const ArchitectureList = ["mvc", "feature"] as const;

export const DatabaseList = ["mongodb", "postgresql", "mysql"] as const;

export const OrmList = ["mongoose", "drizzle", "prisma"] as const;

export const RegistryTypeList = [
  "component",
  "blueprint",
  "guide",
  "schema",
  "foundation",
  "tooling"
] as const;
