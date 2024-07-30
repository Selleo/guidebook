import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
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
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  password: text("password").notNull(),
});

export const files = pgTable("files", {
  ...id,
  ...timestamps,
  filename: text("filename").notNull(),
  url: text("url").notNull(),
  mimetype: text("mimetype").notNull(),
  size: integer("size").notNull(),
});
