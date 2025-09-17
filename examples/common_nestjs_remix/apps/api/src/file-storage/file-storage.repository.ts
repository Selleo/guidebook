import { Inject, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { DatabasePg } from "src/common";
import { file } from "./files-schema";

export type FileRecord = InferSelectModel<typeof file>;
export type NewFileRecord = InferInsertModel<typeof file>;

@Injectable()
export class FileStorageRepository {
  constructor(@Inject("DB") private readonly db: DatabasePg) {}

  async create(data: NewFileRecord): Promise<FileRecord> {
    const [created] = await this.db.insert(file).values(data).returning();

    return created;
  }

  async markDeletedByKey(storageKey: string): Promise<FileRecord | undefined> {
    const [updated] = await this.db
      .update(file)
      .set({ deletedAt: new Date().toISOString() })
      .where(eq(file.storageKey, storageKey))
      .returning();

    return updated;
  }
}
