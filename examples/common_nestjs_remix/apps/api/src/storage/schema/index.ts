import { boolean, pgTable, text } from "drizzle-orm/pg-core";
import { id, timestamps } from "./utils";

export const users = pgTable("users", {
  ...id,
  ...timestamps,
});

export const properties = pgTable("properties", {
  ...id,
  ...timestamps,

  name: text("name").notNull(),
  description: text("description"),
});
