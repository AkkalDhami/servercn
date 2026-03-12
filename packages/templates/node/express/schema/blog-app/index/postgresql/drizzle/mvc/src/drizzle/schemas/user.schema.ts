import {
  pgTable,
  varchar,
  boolean,
  timestamp,
  integer,
  json,
  uniqueIndex,
  index,
  pgEnum,
  serial
} from "drizzle-orm/pg-core";
import { timestamps } from "./schema.helper";
import { relations } from "drizzle-orm";
import { posts } from "./post.schema";
import { postLikes } from "./post-like.schema";
import { commentLikes } from "./comment-like.schema";
import { comments } from "./comment.schema";

interface IAvatar {
  public_id?: string;
  url: string;
  size?: number;
}

const providerEnum = pgEnum("provider", ["local", "google", "github"]);

const roleEnum = pgEnum("role", ["user", "admin"]);

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }),
    role: roleEnum("role").default("user").notNull(),

    provider: providerEnum("provider")
      .default("local")
      .notNull(),
    providerId: varchar("provider_id", { length: 255 }),

    avatar: json("avatar").$type<IAvatar>(),

    isEmailVerified: boolean("is_email_verified").default(false).notNull(),
    lastLoginAt: timestamp("last_login_at"),
    failedLoginAttempts: integer("failed_login_attempts").default(0).notNull(),
    lockUntil: timestamp("lock_until"),

    isDeleted: boolean("is_deleted").default(false).notNull(),
    deletedAt: timestamp("deleted_at"),
    reActivateAvailableAt: timestamp("re_activate_available_at"),

    ...timestamps
  },
  (table) => [
    uniqueIndex("email_idx").on(table.email),
    index("role_idx").on(table.role),
    index("is_deleted_idx").on(table.isDeleted)
  ]
);

//* relations:
export const usersRelations = relations(users, ({ many }) => ({
  //? relation with posts: user has many posts
  posts: many(posts),

  //? relation with post_likes: user has many likes
  postLikes: many(postLikes),

  //? relation with comment_likes: user has many comment likes
  commentLikes: many(commentLikes),

  //? relation with comments: user has many comments
  comments: many(comments)
}));

//? User type
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
