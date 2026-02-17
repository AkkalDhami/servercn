import packageJson from "../../package.json";

export const GITHUB_BASE_URL = "gh:AkkalDhami/servercn/packages/templates";

export const SERVERCN_URL = "https://servercn.vercel.app";

export const SERVERCN_CONFIG_FILE = "servercn.config.json" as const;

export const APP_NAME = "ServerCN";

export const LATEST_VERSION = packageJson.version || "1.0.0";

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
