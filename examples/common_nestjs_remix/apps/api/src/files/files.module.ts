import { Module } from "@nestjs/common";
import { FileService } from "./file.service";
import { FileController } from "./api/file.controller";

@Module({
  providers: [FileService],
  controllers: [FileController],
})
export class FilesModule {}
