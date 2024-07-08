import { createSelectSchema } from "drizzle-typebox";
import { properties } from "src/storage/schema";

export const propertySchema = createSelectSchema(properties);
