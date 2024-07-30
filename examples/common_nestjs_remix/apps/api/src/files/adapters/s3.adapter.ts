import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DatabasePg } from "../../common";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { v7 as uuid } from "uuid";
import { files } from "../../storage/schema";
import { CommonFile } from "../../common/schemas/common-file.schema";
import { eq } from "drizzle-orm";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { FilesAdapter } from "./files.adapter";

@Injectable()
export class S3FileAdapter extends FilesAdapter {
  private client: S3Client;
  private bucketName = this.configService.getOrThrow<string>("aws.BUCKET_NAME");

  constructor(
    private configService: ConfigService,
    @Inject("DB") private readonly db: DatabasePg,
  ) {
    super();
    this.client = new S3Client({
      region: this.configService.getOrThrow<string>("aws.AWS_REGION"),
      endpoint: this.configService.getOrThrow<string>("aws.AWS_ENDPOINT"),
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>(
          "aws.AWS_ACCESS_KEY_ID",
        ),
        secretAccessKey: this.configService.getOrThrow<string>(
          "aws.AWS_SECRET_ACCESS_KEY",
        ),
      },
      forcePathStyle: true,
    });
  }

  async uploadFile(file: Express.Multer.File) {
    try {
      const key = `${uuid()}-${file.originalname}`;
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        Metadata: {
          originalname: file.originalname,
        },
      });
      console.log(this.client);

      const uploadResult = await this.client.send(command);

      if (
        !uploadResult.$metadata.httpStatusCode ||
        uploadResult.$metadata.httpStatusCode !== 200
      ) {
        throw new InternalServerErrorException("Failed to upload file");
      }

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

      return this.getPublicUrl(file.url);
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

      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: file.url,
      });
      await this.client.send(command);

      await this.db.delete(files).where(eq(files.id, id)).execute();
    } catch (error) {
      throw new InternalServerErrorException("Failed to delete file");
    }
  }

  private async getPublicUrl(key: string) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const url = await getSignedUrl(this.client, command, {
        expiresIn: 60 * 60 * 24,
      });

      return { url };
    } catch (error) {
      throw new InternalServerErrorException("Failed to get file");
    }
  }
}
