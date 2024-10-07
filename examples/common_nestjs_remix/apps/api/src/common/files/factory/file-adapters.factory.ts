import { Injectable } from "@nestjs/common";
import { S3FileAdapter } from "../adapters/s3.adapter";
import { match, P } from "ts-pattern";
import { ConfigService } from "@nestjs/config";
import { FilesAdapter } from "../adapters/files.adapter";
import { LocalFilesAdapter } from "../adapters";
import { ModuleRef } from "@nestjs/core";

type AdapterType = "local" | "s3";

@Injectable()
export class FileAdapterFactory {
  constructor(
    private moduleRef: ModuleRef,
    private configService: ConfigService,
  ) {}

  async createAdapter(): Promise<FilesAdapter> {
    const adapterType = this.configService.get<AdapterType>("FILE_ADAPTER");
    const adapter = match(adapterType)
      .with("local", () => LocalFilesAdapter)
      .with("s3", () => S3FileAdapter)
      .with(P.nullish, () => {
        throw new Error("FILE_ADAPTER is not defined in configuration");
      })
      .otherwise((type) => {
        throw new Error(`Unknown file adapter type: ${type}`);
      });

    return await this.moduleRef.create<FilesAdapter>(adapter);
  }
}
