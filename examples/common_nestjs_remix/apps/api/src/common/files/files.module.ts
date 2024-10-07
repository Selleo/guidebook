import { Module } from "@nestjs/common";
import { FileService } from "./file.service";
import { ConfigModule } from "@nestjs/config";
import { FileAdapterFactory } from "./factory/file-adapters.factory";
import { FilesAdapter } from "./adapters/files.adapter";

@Module({
  imports: [ConfigModule],
  providers: [
    FileService,
    FileAdapterFactory,
    {
      provide: FilesAdapter,
      useFactory: (factory: FileAdapterFactory) => factory.createAdapter(),
      inject: [FileAdapterFactory],
    },
  ],
  exports: [FileService],
})
export class FilesModule {}
