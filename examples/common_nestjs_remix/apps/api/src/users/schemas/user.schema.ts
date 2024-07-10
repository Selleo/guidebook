import { Type, Static } from "@sinclair/typebox";
import { createSelectSchema } from "drizzle-typebox";
import { users } from "src/storage/schema";

const schema = createSelectSchema(users);
export const userSchema = Type.Omit(schema, ["password", "refreshToken"]);

export const allUsersSchema = Type.Array(userSchema);

export type UserResponse = Static<typeof userSchema>;
export type AllUsersResponse = Static<typeof allUsersSchema>;
