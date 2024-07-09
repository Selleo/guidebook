import { Type } from "@sinclair/typebox";
import { createSelectSchema } from "drizzle-typebox";
import { users } from "src/storage/schema";

const schema = createSelectSchema(users);

export const accountSchema = Type.Omit(schema, ["password", "refreshToken"]);

export const accountIdSchema = Type.Pick(schema, ["id"]);
