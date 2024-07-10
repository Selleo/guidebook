import { Static } from "@sinclair/typebox";
import { createSelectSchema } from "drizzle-typebox";
import { users } from "src/storage/schema";

const localPayloadSchema = createSelectSchema(users);

export type LocalPayload = Static<typeof localPayloadSchema>;
