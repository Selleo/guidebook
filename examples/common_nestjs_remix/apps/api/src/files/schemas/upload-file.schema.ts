import { Static, Type } from "@sinclair/typebox";

export const uploadFileSchema = Type.Object({
  isPublic: Type.Boolean(),
});

export type UploadFile = Static<typeof uploadFileSchema>;
