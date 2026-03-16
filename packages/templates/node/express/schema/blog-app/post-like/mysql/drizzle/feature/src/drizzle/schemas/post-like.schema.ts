import { mysqlTable, int, uniqueIndex } from "drizzle-orm/mysql-core";
import { timestamps } from "./schema.helper";
import { relations } from "drizzle-orm";

export const postLikes = mysqlTable(
  "post_likes",
  {
    userId: int("user_id")
      // .references(() => users.id, { onDelete: "cascade" })
      .notNull(),

    postId: int("post_id")
      // .references(() => posts.id, { onDelete: "cascade" })
      .notNull(),
    ...timestamps
  },
  table => [uniqueIndex("unique_like").on(table.userId, table.postId)]
);

//* relations:
export const postLikesRelations = relations(postLikes, ({ one }) => ({
  //TODO: relation with users: one like belongs to one user
  //TODO: relation with posts: one like belongs to one post
}));
