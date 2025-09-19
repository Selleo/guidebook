import { Inject, Injectable } from "@nestjs/common";
import { InferInsertModel, eq } from "drizzle-orm";
import { DatabasePg } from "src/common";
import { FileStorageAdapter } from "./adapters/file-storage.adapter";
import {
  StoredFile,
  StoredFileUploadResult,
  UploadFileInput,
} from "./file-storage.types";
import { file } from "./files-schema";

type NewFileRecord = InferInsertModel<typeof file>;

@Injectable()
export class FileStorageService {
  constructor(
    private readonly adapter: FileStorageAdapter,
    @Inject("DB") private readonly db: DatabasePg,
  ) {}

  async uploadFile(input: UploadFileInput): Promise<StoredFileUploadResult> {
    const uploadResult = await this.adapter.uploadFile(input);
    const byteSize = this.resolveByteSize(input);

    const fileRecord = await this.create({
      storageKey: uploadResult.key,
      bucket: uploadResult.bucket,
      originalName:
        input.originalName ?? input.metadata?.originalName ?? uploadResult.key,
      mimeType: input.contentType ?? "application/octet-stream",
      byteSize,
      entityRef: input.entityRef,
    });

    return {
      ...uploadResult,
      file: fileRecord,
    };
  }

  async deleteFile(key: string): Promise<void> {
    await this.adapter.deleteFile(key);
    await this.markDeletedByKey(key);
  }

  generateEntityRef(entityType: 'user', entityId: string) {
    return `${entityType}:${entityId}`;
  }

  private resolveByteSize(input: UploadFileInput): number {
    if (typeof input.byteSize === "number") {
      return input.byteSize;
    }

    if (Buffer.isBuffer(input.body)) {
      return input.body.byteLength;
    }

    if (typeof input.body === "string") {
      return Buffer.byteLength(input.body);
    }

    if (input.body instanceof Uint8Array) {
      return input.body.byteLength;
    }

    throw new Error(
      "Unable to determine file size. Provide byteSize in input.",
    );
  }

  private async create(data: NewFileRecord): Promise<StoredFile> {
    const [created] = await this.db.insert(file).values(data).returning();

    return created;
  }

  private async markDeletedByKey(
    storageKey: string,
  ): Promise<StoredFile | undefined> {
    const [updated] = await this.db
      .update(file)
      .set({ deletedAt: new Date().toISOString() })
      .where(eq(file.storageKey, storageKey))
      .returning();

    return updated;
  }
}
