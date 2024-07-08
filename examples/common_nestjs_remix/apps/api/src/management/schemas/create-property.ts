import { Type } from "@sinclair/typebox";

export const createPropertySchema = Type.Object({
  name: Type.String(),
  description: Type.Optional(Type.String()),
});
