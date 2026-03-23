export const resolveRegistryItem = (
  slug: string
): {
  slug: string;
  database?: string;
  orm?: string;
} => {
  switch (slug) {
    case "banking-app-mongodb":
      return {
        slug: "banking-app",
        database: "mongodb",
        orm: "mongoose"
      };
    case "banking-app-mysql":
      return {
        slug: "banking-app",
        database: "mysql",
        orm: "drizzle"
      };
    case "banking-app-pg":
    case "banking-app-postgresql":
      return {
        slug: "banking-app",
        database: "postgresql",
        orm: "drizzle"
      };

    case "hybrid-auth-mongodb":
      return {
        slug: "hybrid-auth",
        database: "mongodb",
        orm: "mongoose"
      };
    case "hybrid-auth-mysql":
      return {
        slug: "hybrid-auth",
        database: "mysql",
        orm: "drizzle"
      };
    case "hybrid-auth-pg":
      return {
        slug: "hybrid-auth",
        database: "postgresql",
        orm: "drizzle"
      };

    case "stateful-auth-mongodb":
      return {
        slug: "stateful-auth",
        database: "mongodb",
        orm: "mongoose"
      };
    case "stateful-auth-mysql":
      return {
        slug: "stateful-auth",
        database: "mysql",
        orm: "drizzle"
      };
    case "stateful-auth-pg":
      return {
        slug: "stateful-auth",
        database: "postgresql",
        orm: "drizzle"
      };

    case "stateless-auth-mongodb":
      return {
        slug: "stateless-auth",
        database: "mongodb",
        orm: "mongoose"
      };
    case "stateless-auth-mysql":
      return {
        slug: "stateless-auth",
        database: "mysql",
        orm: "drizzle"
      };
    case "stateless-auth-pg":
      return {
        slug: "stateless-auth",
        database: "postgresql",
        orm: "drizzle"
      };

    case "auth-mongodb":
      return {
        slug: "auth",
        database: "mongodb",
        orm: "mongoose"
      };
    case "auth-mysql":
      return {
        slug: "auth",
        database: "mysql",
        orm: "drizzle"
      };
    case "auth-postgresql":
      return {
        slug: "auth",
        database: "postgresql",
        orm: "drizzle"
      };

    case "blog-app-mongodb":
      return {
        slug: "blog-app",
        database: "mongodb",
        orm: "mongoose"
      };
    case "blog-app-mysql":
      return {
        slug: "blog-app",
        database: "mysql",
        orm: "drizzle"
      };
    case "blog-app-pg":
    case "blog-app-postgresql":
      return {
        slug: "blog-app",
        database: "postgresql",
        orm: "drizzle"
      };

    case "todo-mongodb":
      return {
        slug: "todo",
        database: "mongodb",
        orm: "mongoose"
      };
    case "todo-mysql":
      return {
        slug: "todo",
        database: "mysql",
        orm: "drizzle"
      };
    case "todo-pg":
    case "todo-postgresql":
      return {
        slug: "todo",
        database: "postgresql",
        orm: "drizzle"
      };

    default:
      return {
        slug
      };
  }
};
