import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { S3FileAdapter } from "./adapters";
import { LocalFilesAdapter } from "./adapters";
import { DatabasePg } from "../common";
import { CommonFile } from "../common/schemas/common-file.schema";

@Injectable()
export class FileService {
  private storageAdapter: LocalFilesAdapter | S3FileAdapter;

  constructor(configService: ConfigService, @Inject("DB") db: DatabasePg) {
    if (configService.get("ENVIRONMENT") === "development") {
      this.storageAdapter = new LocalFilesAdapter(configService, db);
    } else {
      this.storageAdapter = new S3FileAdapter(configService, db);
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<CommonFile> {
    return await this.storageAdapter.uploadFile(file);
  }

  async deleteFile(key: string): Promise<void> {
    return await this.storageAdapter.deleteFile(key);
  }

  async getFileUrl(key: string): Promise<{ url: string }> {
    return await this.storageAdapter.getFileUrl(key);
  }
}
