import { CommonFile } from "../../common/schemas/common-file.schema";

export abstract class FilesAdapter {
  abstract uploadFile(file: Express.Multer.File): Promise<CommonFile>;

  abstract deleteFile(id: string): Promise<void>;

  abstract getFileUrl(id: string): Promise<{ url: string }>;
}
