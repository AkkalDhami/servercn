import {
  boolean,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  index
} from "drizzle-orm/pg-core";
import { users } from "./user.schema";

export const todos = pgTable(
  "todos",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    completed: boolean("completed").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow()
  },
  table => [
    index("todo_user_id_idx").on(table.userId),
    index("todo_completed_idx").on(table.completed)
  ]
);

export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;
