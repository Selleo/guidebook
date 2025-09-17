import { UploadFileInput, UploadFileResult } from "../file-storage.types";

export abstract class FileStorageAdapter {
  abstract uploadFile(input: UploadFileInput): Promise<UploadFileResult>;

  abstract deleteFile(key: string): Promise<void>;
}
