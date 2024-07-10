import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { id, timestamps } from "./utils";

export const users = pgTable("users", {
  ...id,
  ...timestamps,
  email: text("email").notNull().unique(),
});

export const credentials = pgTable("credentials", {
  ...id,
  ...timestamps,
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  password: text("password").notNull(),
  refreshToken: text("refresh_token"),
});
