import { mysqlTable, int, text } from "drizzle-orm/mysql-core";

import { timestamps } from "./schema.helper";
import { relations } from "drizzle-orm";

export const comments = mysqlTable("comments", {
  id: int("id").primaryKey().autoincrement(),

  postId: int("post_id")
  // .references(() => posts.id),
    .notNull(),

  authorId: int("author_id")
  // .references(() => users.id),
    .notNull(),

  content: text("content").notNull(),

  parentCommentId: int("parent_comment_id"),
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
