/**
 * Common enums to avoid string drift across the system
 */
export type Stack = "express";

export type Architecture = "mvc" | "feature";

export type Variant = "minimal" | "advanced";

export type Database = "mysql" | "postgresql" | "mongodb";

export type Orm = "drizzle" | "mongoose";

export type RegistryType = "schema" | "component" | "foundation" | "blueprint";

/**
 * Leaf node: actual filesystem path
 */
export type TemplatePath = string;

/**
 * Variant → Path
 */
export type VariantMap = Record<Variant, TemplatePath>;

/**
 * Architecture → Variant → Path
 */
export type ArchitectureMap = Record<Architecture, VariantMap>;

/**
 * ORM → Architecture → Variant → Path
 */
export type OrmMap = Record<Orm, ArchitectureMap>;

/**
 * Database → ORM → Architecture → Variant → Path
 *
 * Note:
 * - SQL databases use Drizzle
 * - MongoDB uses Mongoose
 */
export type DatabaseMap = Partial<Record<Database, OrmMap>>;

/**
 * Stack → Database → ORM → Architecture → Variant → Path
 */
export type StackTemplateMap = Record<Stack, DatabaseMap>;

/**
 * Dependency definition
 */
export interface RegistryDependencies {
  runtime: string[];
  dev: string[];
}

/**
 * Main registry interface
 */
export interface SchemaRegistry {
  title: string;
  slug: string;
  type: RegistryType;
  domain: string;

  stacks: Stack[];
  architectures: Architecture[];
  variants: Variant[];
  databases: Database[];

  templates: StackTemplateMap;

  dependencies: RegistryDependencies;
}
