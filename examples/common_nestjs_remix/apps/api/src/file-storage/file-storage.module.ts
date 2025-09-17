import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { FileStorageAdapter } from "./adapters/file-storage.adapter";
import { StandardAdapter } from "./adapters/standard.adapter";
import { DevAdapter } from "./adapters/dev.adapter";
import { FileStorageAdapterFactory } from "./factory/file-storage-adapter.factory";
import { FileStorageRepository } from "./file-storage.repository";
import { FileStorageService } from "./file-storage.service";

@Module({
  imports: [ConfigModule],
  providers: [
    FileStorageService,
    FileStorageRepository,
    FileStorageAdapterFactory,
    DevAdapter,
    StandardAdapter,
    {
      provide: FileStorageAdapter,
      useFactory: (factory: FileStorageAdapterFactory) => factory.createAdapter(),
      inject: [FileStorageAdapterFactory],
    },
  ],
  exports: [FileStorageService],
})
export class FileStorageModule {}
