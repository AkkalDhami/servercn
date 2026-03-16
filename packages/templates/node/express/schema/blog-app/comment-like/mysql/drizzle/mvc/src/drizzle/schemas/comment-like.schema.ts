import { mysqlTable, int, uniqueIndex } from "drizzle-orm/mysql-core";
import { timestamps } from "./schema.helper";
import { relations } from "drizzle-orm";

export const commentLikes = mysqlTable(
  "comment_likes",
  {
    userId: int("user_id")
      // .references(() => users.id),
      .notNull(),

    commentId: int("comment_id")
      // .references(() => comments.id),
      .notNull(),

    ...timestamps
  },
  table => [
    uniqueIndex("unique_comment_like").on(table.userId, table.commentId)
  ]
);

//* relations:
export const commentLikesRelations = relations(commentLikes, ({ one }) => ({
  //TODO: relation with users: one like belongs to one user
  //TODO: relation with comments: one like belongs to one comment
}));
