import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { S3FileAdapter } from "./adapters";
import { LocalFilesAdapter } from "./adapters";

@Injectable()
export class FileService {
  private storageAdapter: LocalFilesAdapter | S3FileAdapter;

  constructor(configService: ConfigService) {
    if (configService.get("ENVIRONMENT") === "development") {
      this.storageAdapter = new LocalFilesAdapter(configService);
    } else {
      this.storageAdapter = new S3FileAdapter(configService);
    }
  }

  async uploadFile(
    directory: string,
    file: Express.Multer.File,
  ): Promise<{ path: string }> {
    return await this.storageAdapter.uploadFile(directory, file);
  }

  async deleteFile(key: string): Promise<void> {
    return await this.storageAdapter.deleteFile(key);
  }

  async getFileUrl(key: string): Promise<{ url: string }> {
    return await this.storageAdapter.getFileUrl(key);
  }
}
