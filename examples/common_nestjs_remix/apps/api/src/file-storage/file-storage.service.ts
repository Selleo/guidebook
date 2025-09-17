import { Injectable } from "@nestjs/common";
import { FileStorageAdapter } from "./adapters/file-storage.adapter";
import { UploadFileInput, UploadFileResult } from "./file-storage.types";

@Injectable()
export class FileStorageService {
  constructor(private readonly adapter: FileStorageAdapter) {}

  uploadFile(input: UploadFileInput): Promise<UploadFileResult> {
    return this.adapter.uploadFile(input);
  }

  deleteFile(key: string): Promise<void> {
    return this.adapter.deleteFile(key);
  }
}
