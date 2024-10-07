import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { v7 as uuid } from "uuid";
import * as fs from "node:fs";
import * as path from "node:path";
import { FilesAdapter } from "./files.adapter";

@Injectable()
export class LocalFilesAdapter extends FilesAdapter {
  uploadsDir = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    "..",
    this.configService.getOrThrow<string>("localFile.uploadDir"),
  );
  constructor(private configService: ConfigService) {
    super();
  }

  async uploadFile(directory: string, file: Express.Multer.File) {
    try {
      const key = `${directory}/${uuid()}-${file.originalname}`;
      fs.writeFile(path.join(this.uploadsDir, key), file.buffer, (err) => {
        if (err) {
          throw new InternalServerErrorException("Failed to upload file");
        }
      });

      return { path: key };
    } catch (error) {
      throw new InternalServerErrorException("Failed to upload file");
    }
  }

  async getFileUrl(path: string): Promise<{ url: string }> {
    try {
      const url = `https://storage.guidebook.localhost/${path}`;
      return { url: url };
    } catch (error) {
      throw new InternalServerErrorException("Failed to get file");
    }
  }

  async deleteFile(url: string): Promise<void> {
    try {
      fs.unlinkSync(path.join(this.uploadsDir, url));
    } catch (error) {
      throw new InternalServerErrorException("Failed to delete file");
    }
  }
}
