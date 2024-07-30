import {
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { BaseResponse, UUIDSchema } from "../../common";
import { Validate } from "nestjs-typebox";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileService } from "../file.service";

@Controller("files")
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: ".(png|jpeg|jpg)" })
        .addMaxSizeValidator({ maxSize: 10 * 1024 * 1024 })
        .build(),
    )
    file: Express.Multer.File,
  ) {
    const result = await this.fileService.uploadFile(file);

    return new BaseResponse(result);
  }

  @Get("download/:id")
  @Validate({
    request: [{ type: "param", name: "id", schema: UUIDSchema }],
  })
  async downloadFile(@Param("id") id: string) {
    return new BaseResponse(await this.fileService.getFileUrl(id));
  }

  @Delete(":id")
  @Validate({
    request: [{ type: "param", name: "id", schema: UUIDSchema }],
  })
  async deleteFile(@Param("id") id: string) {
    await this.fileService.deleteFile(id);
  }
}
