import { Readable } from "stream";
import type { InferSelectModel } from "drizzle-orm";
import type { file } from "./files-schema";

export type UploadFileInput = {
  key: string;
  body: Buffer | Uint8Array | string | Readable;
  contentType?: string;
  metadata?: Record<string, string>;
  acl?: "private" | "public-read";
  cacheControl?: string;
  originalName?: string;
  byteSize?: number;
  entityRef?: string;
};

export type UploadFileResult = {
  bucket: string;
  key: string;
  eTag?: string;
};

export type StoredFile = InferSelectModel<typeof file>;

export type StoredFileUploadResult = UploadFileResult & {
  file: StoredFile;
};
