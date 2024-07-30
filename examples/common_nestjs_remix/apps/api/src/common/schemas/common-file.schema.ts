import { files } from "src/storage/schema";
import { createSelectSchema } from "drizzle-typebox";
import { Static } from "@sinclair/typebox";

export const commonFileSchema = createSelectSchema(files);

export type CommonFile = Static<typeof commonFileSchema>;
