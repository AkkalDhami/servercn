import { timestamp } from "drizzle-orm/mysql-core";

export const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull()
};
