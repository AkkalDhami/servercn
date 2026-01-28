import {
  boolean,
  mysqlTable,
  text,
  timestamp,
  varchar,
  char,
  index
} from "drizzle-orm/mysql-core";
import { users } from "./user.schema";

export const todos = mysqlTable(
  "todos",
  {
    id: char("id", { length: 36 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: char("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    completed: boolean("completed").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow()
  },
  table => [
    index("todo_user_id_idx").on(table.userId),
    index("todo_completed_idx").on(table.completed)
  ]
);

export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;
