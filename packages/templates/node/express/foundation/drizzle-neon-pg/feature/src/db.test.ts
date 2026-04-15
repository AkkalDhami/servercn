import db from "./shared/configs/db";
import { usersTable } from "./db/schemas/user.schema";

export async function main() {
  const user: typeof usersTable.$inferInsert = {
    name: "John",
    age: 30,
    email: "john@example.com"
  };
  await db.insert(usersTable).values(user);
 
  const users = await db.select().from(usersTable);
  console.log({ users });
}
