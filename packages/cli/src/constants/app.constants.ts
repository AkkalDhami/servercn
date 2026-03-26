import packageJson from "../../package.json";

export const SERVERCN_URL = "https://servercn.vercel.app";

export const SERVERCN_CONFIG_FILE = "servercn.config.json" as const;

export const APP_NAME = "servercn";

export const LATEST_VERSION = packageJson.version || "1.0.0";

export const RuntimeList = ["node"] as const;

export const FrameworkList = ["express", "nestjs", "nextjs"] as const;

export const LanguageList = ["typescript"] as const;

export const ArchitectureList = [
  "mvc",
  "feature",
  "modular",
  "file-api"
] as const;

export const DatabaseList = ["mongodb", "postgresql", "mysql"] as const;

export const OrmList = ["mongoose", "drizzle", "prisma"] as const;

export const RegistryTypeList = [
  "component",
  "blueprint",
  "schema",
  "foundation",
  "tooling",
  "provider"
] as const;
