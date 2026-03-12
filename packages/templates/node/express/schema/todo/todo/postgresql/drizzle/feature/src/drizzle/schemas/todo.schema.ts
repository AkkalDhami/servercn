import {
  boolean,
  text,
  varchar,
  integer,
  index,
  serial,
  pgTable
} from "drizzle-orm/pg-core";
import { timestamps } from "./schema.helper";

export const todos = pgTable(
  "todos",
  {
    id: serial().primaryKey(),
    userId: integer("user_id")
    //   .references(() => users.id, { onDelete: "cascade" }),
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

//TODO: Add Relations between
//? i. todo and users.
//? (many-to-one)
// export const todosRelations = relations(todos, ({ one }) => ({
//   user: one(users, {
//     fields: [todos.userId],
//     references: [users.id]
//   })
// }));

export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;
