import { pgTable } from "drizzle-orm/pg-core";
import { id, timestamps } from "./utils";

export const users = pgTable("users", {
  ...id,
  ...timestamps,
});
