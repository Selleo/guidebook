import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ModuleRef } from "@nestjs/core";
import { match, P } from "ts-pattern";
import { FileStorageConfigSchema } from "src/common/configuration/file-storage";
import { FileStorageAdapter } from "../adapters/file-storage.adapter";
import { StandardAdapter } from "../adapters/standard.adapter";
import { DevAdapter } from "../adapters/dev.adapter";

type AdapterType = FileStorageConfigSchema["FILE_STORAGE_ADAPTER"];

@Injectable()
export class FileStorageAdapterFactory {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly configService: ConfigService,
  ) {}

  async createAdapter() {
    const adapterType = this.configService.get<AdapterType>(
      "fileStorage.FILE_STORAGE_ADAPTER",
    );

    const adapter = match(adapterType)
      .with("dev", () => DevAdapter)
      .with("standard", () => StandardAdapter)
      .with(P.nullish, () => {
        throw new Error("FILE_STORAGE_ADAPTER is not defined in configuration");
      })
      .otherwise((type) => {
        throw new Error(`Unknown file storage adapter type: ${type}`);
      });

    return this.moduleRef.create<FileStorageAdapter>(adapter);
  }
}
