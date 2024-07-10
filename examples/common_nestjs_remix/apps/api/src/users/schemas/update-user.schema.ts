import { Static, Type } from "@sinclair/typebox";
import { createSelectSchema } from "drizzle-typebox";
import { users } from "src/storage/schema";

const schema = createSelectSchema(users);

export const userSchema = Type.Omit(schema, ["password", "refreshToken"]);

export const updateUserSchema = Type.Object({
  email: Type.Optional(Type.String({ format: "email" })),
});

export type UpdateUserBody = Static<typeof updateUserSchema>;
