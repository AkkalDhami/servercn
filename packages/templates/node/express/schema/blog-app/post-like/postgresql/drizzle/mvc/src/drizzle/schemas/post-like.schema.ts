import { pgTable, integer, uniqueIndex } from "drizzle-orm/pg-core";
import { timestamps } from "./schema.helper";
import { relations } from "drizzle-orm";

export const postLikes = pgTable(
  "post_likes",
  {
    userId: integer("user_id")
      // .references(() => users.id, { onDelete: "cascade" })
      .notNull(),

    postId: integer("post_id")
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
