import {
  boolean,
  text,
  varchar,
  char,
  index,
  serial,
  pgTable
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { timestamps } from "./schema.helper";

// import { users } from "./user.schema";

export const todos = pgTable(
  "todos",
  {
    id: serial().primaryKey(),
    // userId: char("user_id", { length: 36 })
    //   .notNull()
    //   .references(() => users.id, { onDelete: "cascade" }),

    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    completed: boolean("completed").notNull().default(false),

    ...timestamps
  },
  table => [
    // index("todo_user_id_idx").on(table.userId),
    index("todo_completed_idx").on(table.completed)
  ]
);

//? Relations between
//? ii. todo and users.
//? (many-to-one)
// export const todosRelations = relations(todos, ({ one }) => ({
//   user: one(users, {
//     fields: [todos.userId],
//     references: [users.id]
//   })
// }));

export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;
