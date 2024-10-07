import { Injectable } from "@nestjs/common";
import { FilesAdapter } from "./adapters/files.adapter";

@Injectable()
export class FileService {
  constructor(private fileAdapter: FilesAdapter) {}

  async uploadFile(
    directory: string,
    file: Express.Multer.File,
  ): Promise<{ path: string }> {
    return await this.fileAdapter.uploadFile(directory, file);
  }

  async deleteFile(key: string): Promise<void> {
    return await this.fileAdapter.deleteFile(key);
  }

  async getFileUrl(key: string): Promise<{ url: string }> {
    return await this.fileAdapter.getFileUrl(key);
  }
}
