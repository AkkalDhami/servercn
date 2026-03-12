import { mysqlTable, int, text } from "drizzle-orm/mysql-core";

import { posts } from "./post.schema";
import { users } from "./user.schema";
import { timestamps } from "./schema.helper";
import { relations } from "drizzle-orm";
import { commentLikes } from "./comment-like.schema";

export const comments = mysqlTable("comments", {
  id: int("id").primaryKey().autoincrement(),

  postId: int("post_id")
    .notNull()
    .references(() => posts.id),

  authorId: int("author_id")
    .notNull()
    .references(() => users.id),

  content: text("content").notNull(),

  parentCommentId: int("parent_comment_id"),
  ...timestamps
});

//* relations:
export const commentsRelations = relations(comments, ({ one, many }) => ({
  //? relation with posts: one comment belongs to one post
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id]
  }),

  //? relation with users: one comment belongs to one user
  author: one(users, {
    fields: [comments.authorId],
    references: [users.id]
  }),

  //? relation with comments: one comment belongs to one parent comment
  parentComment: one(comments, {
    fields: [comments.parentCommentId],
    references: [comments.id]
  }),

  //? relation with comments: one comment has many replies
  replies: many(comments),

  //? relation with comment_likes: one comment has many likes
  likes: many(commentLikes)
}));
