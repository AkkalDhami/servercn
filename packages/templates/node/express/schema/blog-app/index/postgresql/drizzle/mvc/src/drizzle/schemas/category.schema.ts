import { serial, pgTable, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "./schema.helper";
import { relations } from "drizzle-orm";
import { posts } from "./post.schema";

export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug").notNull().unique(),
    description: varchar("description"),

    ...timestamps
  },
  (table) => [
    uniqueIndex("slug_idx").on(table.slug),
    uniqueIndex("name_idx").on(table.name)
  ]
);

//? relation with posts: one category has many posts
export const categoriesRelations = relations(categories, ({ many }) => ({
  posts: many(posts)
}));

export type NewCategory = typeof categories.$inferInsert;
export type Category = typeof categories.$inferSelect;
