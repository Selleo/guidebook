import { Readable } from "stream";

export type UploadFileInput = {
  key: string;
  body: Buffer | Uint8Array | string | Readable;
  contentType?: string;
  metadata?: Record<string, string>;
  acl?: "private" | "public-read";
  cacheControl?: string;
};

export type UploadFileResult = {
  bucket: string;
  key: string;
  eTag?: string;
};
