export abstract class FilesAdapter {
  abstract uploadFile(
    path: string,
    file: Express.Multer.File,
  ): Promise<{ path: string }>;

  abstract deleteFile(id: string): Promise<void>;

  abstract getFileUrl(id: string): Promise<{ url: string }>;
}
