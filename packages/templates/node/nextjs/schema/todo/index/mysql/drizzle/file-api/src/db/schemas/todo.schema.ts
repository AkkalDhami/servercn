import {
  boolean,
  mysqlTable,
  text,
  varchar,
  index,
  int
} from "drizzle-orm/mysql-core";
import { timestamps } from "./schema.helper";

export const todos = mysqlTable(
  "todos",
  {
    id: int("id").primaryKey().autoincrement(),
    userId: int("user_id")
      // .references(() => users.id, { onDelete: "cascade" }),
      .notNull(),

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

//TODO: Relations between
//? ii. todo and users.
//? (many-to-one)

export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;
