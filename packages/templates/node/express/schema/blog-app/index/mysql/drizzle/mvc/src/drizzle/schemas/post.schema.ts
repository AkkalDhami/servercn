import {
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  timestamp,
  uniqueIndex,
  varchar
} from "drizzle-orm/mysql-core";
import { timestamps } from "./schema.helper";
import { users } from "./user.schema";
import { relations } from "drizzle-orm";
import { categories } from "./category.schema";
import { postLikes } from "./post-like.schema";

const POST_STATUSES = ["draft", "published", "archived"] as const;

interface IFile {
  public_id: string;
  url: string;
  size: number;
}

export const posts = mysqlTable(
  "posts",
  {
    id: int().primaryKey().autoincrement(),

    title: varchar("title", { length: 100 }).notNull(),
    slug: varchar("slug").notNull().unique(),
    content: varchar("description"),
    excerpt: varchar("excerpt"), // Short summary

    authorId: int("author_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(), // Reference to User
    categoryId: int("category_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),

    tags: json("tags").$type<string[]>(),
    featuredImage: json("featured_image").$type<IFile>(),
    views: int("views").default(0).notNull(),

    status: mysqlEnum("status", POST_STATUSES).default("draft").notNull(),
    publishedAt: timestamp("published_at"),

    ...timestamps
  },
  (table) => [
    uniqueIndex("author_id_slug_unique").on(table.authorId, table.slug),
    index("category_idx").on(table.categoryId),
    index("status_idx").on(table.status)
  ]
);

//* relations:
export const postsRelations = relations(posts, ({ one, many }) => ({
  //? relation with users: post belongs to one user
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id]
  }),

  //? relation with categories: Post belongs to one category
  category: one(categories, {
    fields: [posts.categoryId],
    references: [categories.id]
  }),

  //? relation with post_likes: one post has many likes
  postLikes: many(postLikes)
}));

export type NewPost = typeof posts.$inferInsert;
export type Post = typeof posts.$inferSelect;
