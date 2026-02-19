import {
  boolean,
  mysqlTable,
  text,
  varchar,
  char,
  index,
  int
} from "drizzle-orm/mysql-core";
import { users } from "./user.schema";
import { relations } from "drizzle-orm";
import { timestamps } from "./schema.helper";

export const todos = mysqlTable(
  "todos",
  {
    id: int("id").primaryKey().autoincrement(),
    userId: char("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    completed: boolean("completed").notNull().default(false),

    ...timestamps
  },
  table => [
    index("todo_user_id_idx").on(table.userId),
    index("todo_completed_idx").on(table.completed)
  ]
);

//? Relations between
//? ii. todo and users.
//? (many-to-one)
export const todosRelations = relations(todos, ({ one }) => ({
  user: one(users, {
    fields: [todos.userId],
    references: [users.id]
  })
}));

export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;
