import { pgTable, text, bigint, uuid } from "drizzle-orm/pg-core";
import { timestamps } from "src/storage/schema/utils";

export const file = pgTable("file", {
  id: uuid().primaryKey(),
  storageKey: text("storage_key").notNull(),
  bucket: text("bucket").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  byteSize: bigint("byte_size", { mode: "number" }).notNull(),
  entityRef: text("entity_ref"),
  ...timestamps,
});
