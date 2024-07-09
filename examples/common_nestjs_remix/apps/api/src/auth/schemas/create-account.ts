import { Type } from "@sinclair/typebox";

export const createAccountSchema = Type.Object({
  email: Type.String({ format: "email" }),
  password: Type.String({ minLength: 8, maxLength: 64 }),
});
