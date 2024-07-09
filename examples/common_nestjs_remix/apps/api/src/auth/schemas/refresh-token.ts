import { Type } from "@sinclair/typebox";

export const refreshTokenSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
});
