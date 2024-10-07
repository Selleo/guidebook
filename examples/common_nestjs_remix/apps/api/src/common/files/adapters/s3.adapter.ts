import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { v7 as uuid } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { FilesAdapter } from "./files.adapter";

@Injectable()
export class S3FileAdapter extends FilesAdapter {
  private client: S3Client;
  private bucketName = this.configService.getOrThrow<string>("aws.BUCKET_NAME");

  constructor(private configService: ConfigService) {
    super();
    const region = this.configService.getOrThrow<string>("aws.AWS_REGION");
    const endpoint = `https://s3.${region}.amazonaws.com`;
    this.client = new S3Client({
      region,
      endpoint,
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

  async uploadFile(path: string, file: Express.Multer.File) {
    try {
      const key = `${path}/${uuid()}-${file.originalname}`;
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        Metadata: {
          originalname: file.originalname,
        },
      });

      const uploadResult = await this.client.send(command);

      if (
        !uploadResult.$metadata.httpStatusCode ||
        uploadResult.$metadata.httpStatusCode !== 200
      ) {
        throw new InternalServerErrorException("Failed to upload file");
      }

      return { path: key };
    } catch (error) {
      throw new InternalServerErrorException("Failed to upload file");
    }
  }

  async getFileUrl(path: string): Promise<{ url: string }> {
    try {
      return this.getPublicUrl(path);
    } catch (error) {
      throw new InternalServerErrorException("Failed to get file");
    }
  }

  async deleteFile(path: string): Promise<void> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: path,
      });
      await this.client.send(command);
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
