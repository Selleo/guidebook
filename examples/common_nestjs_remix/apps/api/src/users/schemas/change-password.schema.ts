import { Static, Type } from "@sinclair/typebox";
import { createSelectSchema } from "drizzle-typebox";
import { users } from "src/storage/schema";

const schema = createSelectSchema(users);

export const userSchema = Type.Omit(schema, ["password", "refreshToken"]);

export const changePasswordSchema = Type.Object({
  password: Type.String({ minLength: 8, maxLength: 64 }),
});

export type ChangePasswordBody = Static<typeof changePasswordSchema>;
