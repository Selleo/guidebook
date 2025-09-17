import { pgTable, text, bigint, timestamp } from "drizzle-orm/pg-core";
import { id, timestamps } from "src/storage/schema/utils";

export const file = pgTable("file", {
  ...id,
  storageKey: text("storage_key").notNull(),
  bucket: text("bucket").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  byteSize: bigint("byte_size", { mode: "number" }).notNull(),
  entityRef: text("entity_ref"),
  deletedAt: timestamp("deleted_at", {
    mode: "string",
    withTimezone: true,
    precision: 3,
  }),
  ...timestamps,
});
