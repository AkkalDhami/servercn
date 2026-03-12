import { pgTable, integer, text } from "drizzle-orm/pg-core";

import { timestamps } from "./schema.helper";
import { relations } from "drizzle-orm";

export const comments = pgTable("comments", {
  id: integer("id").primaryKey(),

  postId: integer("post_id")
  // .references(() => posts.id),
    .notNull(),

  authorId: integer("author_id")
  // .references(() => users.id),
    .notNull(),

  content: text("content").notNull(),

  parentCommentId: integer("parent_comment_id"),
  ...timestamps
});

//* relations:
export const commentsRelations = relations(comments, ({ one, many }) => ({
  //TODO: relation with posts: one comment belongs to one post

  //TODO: relation with users: one comment belongs to one user

  //TODO: relation with comments: one comment belongs to one parent comment

  //TODO: relation with comments: one comment has many replies

  //TODO: relation with comment_likes: one comment has many likes
}));
