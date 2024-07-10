import { createSelectSchema } from "drizzle-typebox";
import { users } from "src/storage/schema";

export const accountSchema = createSelectSchema(users);
