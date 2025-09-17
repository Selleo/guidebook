import { Injectable } from "@nestjs/common";
import { FileStorageAdapter } from "./adapters/file-storage.adapter";
import {
  StoredFileUploadResult,
  UploadFileInput,
} from "./file-storage.types";
import { FileStorageRepository } from "./file-storage.repository";

@Injectable()
export class FileStorageService {
  constructor(
    private readonly adapter: FileStorageAdapter,
    private readonly repository: FileStorageRepository,
  ) {}

  async uploadFile(input: UploadFileInput): Promise<StoredFileUploadResult> {
    const uploadResult = await this.adapter.uploadFile(input);
    const byteSize = this.resolveByteSize(input);

    const fileRecord = await this.repository.create({
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
    await this.repository.markDeletedByKey(key);
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

    throw new Error("Unable to determine file size. Provide byteSize in input.");
  }
}
