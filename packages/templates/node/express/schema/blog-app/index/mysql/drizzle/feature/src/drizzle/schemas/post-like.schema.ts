import { mysqlTable, int, uniqueIndex } from "drizzle-orm/mysql-core";
import { users } from "./user.schema";
import { posts } from "./post.schema";
import { timestamps } from "./schema.helper";
import { relations } from "drizzle-orm";

export const postLikes = mysqlTable(
  "post_likes",
  {
    userId: int("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),

    postId: int("post_id")
      .references(() => posts.id, { onDelete: "cascade" })
      .notNull(),
    ...timestamps
  },
  (table) => [uniqueIndex("unique_like").on(table.userId, table.postId)]
);

//* relations:
export const postLikesRelations = relations(postLikes, ({ one }) => ({
  //? relation with users: one like belongs to one user
  user: one(users, {
    fields: [postLikes.userId],
    references: [users.id]
  }),

  //? relation with posts: one like belongs to one post
  post: one(posts, {
    fields: [postLikes.postId],
    references: [posts.id]
  })
}));
