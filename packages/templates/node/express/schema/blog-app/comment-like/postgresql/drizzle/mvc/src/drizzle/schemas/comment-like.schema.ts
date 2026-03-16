import { pgTable, integer, uniqueIndex } from "drizzle-orm/pg-core";
import { timestamps } from "./schema.helper";
import { relations } from "drizzle-orm";

export const commentLikes = pgTable(
  "comment_likes",
  {
    userId: integer("user_id")
      // .references(() => users.id),
      .notNull(),

    commentId: integer("comment_id")
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
