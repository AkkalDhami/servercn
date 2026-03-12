import { pgTable, integer, uniqueIndex } from "drizzle-orm/pg-core";
import { comments } from "./comment.schema";
import { users } from "./user.schema";
import { timestamps } from "./schema.helper";
import { relations } from "drizzle-orm";

export const commentLikes = pgTable(
  "comment_likes",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),

    commentId: integer("comment_id")
      .notNull()
      .references(() => comments.id),

    ...timestamps
  },
  (table) => [
    uniqueIndex("unique_comment_like").on(table.userId, table.commentId)
  ]
);

//* relations:
export const commentLikesRelations = relations(commentLikes, ({ one }) => ({
  //? relation with users: one like belongs to one user
  user: one(users, {
    fields: [commentLikes.userId],
    references: [users.id]
  }),

  //? relation with comments: one like belongs to one comment
  comment: one(comments, {
    fields: [commentLikes.commentId],
    references: [comments.id]
  })
}));
