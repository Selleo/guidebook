import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DatabasePg } from "../../common";
import { v7 as uuid } from "uuid";
import { files } from "../../storage/schema";
import { CommonFile } from "../../common/schemas/common-file.schema";
import { eq } from "drizzle-orm";
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
  constructor(
    private configService: ConfigService,
    @Inject("DB") private readonly db: DatabasePg,
  ) {
    super();
  }

  async uploadFile(file: Express.Multer.File) {
    try {
      const key = `${uuid()}-${file.originalname}`;
      fs.writeFile(path.join(this.uploadsDir, key), file.buffer, (err) => {
        if (err) {
          throw new InternalServerErrorException("Failed to upload file");
        }
      });

      const [savedFile] = await this.db
        .insert(files)
        .values({
          url: key,
          filename: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
        })
        .returning();

      return savedFile as CommonFile;
    } catch (error) {
      throw new InternalServerErrorException("Failed to upload file");
    }
  }

  async getFileUrl(id: string): Promise<{ url: string }> {
    try {
      const file = await this.db.query.files.findFirst({
        where: eq(files.id, id),
      });

      if (!file) {
        throw new NotFoundException("File not found");
      }

      const url = `https://storage.guidebook.localhost/${file.url}`;
      return { url: url };
    } catch (error) {
      throw new InternalServerErrorException("Failed to get file");
    }
  }

  async deleteFile(id: string): Promise<void> {
    try {
      const file = await this.db.query.files.findFirst({
        where: eq(files.id, id),
      });

      if (!file) {
        throw new NotFoundException("File not found");
      }

      fs.unlinkSync(path.join(this.uploadsDir, file.url));

      await this.db.delete(files).where(eq(files.id, id)).execute();
    } catch (error) {
      throw new InternalServerErrorException("Failed to delete file");
    }
  }
}
