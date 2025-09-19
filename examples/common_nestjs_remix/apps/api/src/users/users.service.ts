import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { eq } from "drizzle-orm";
import { DatabasePg } from "src/common";
import { user } from "src/storage/schema";
import { FileStorageService } from "src/file-storage";
import { randomUUID } from "crypto";
import type { Express } from "express";

@Injectable()
export class UsersService {
  constructor(
    @Inject("DB") private readonly db: DatabasePg,
    private readonly fileStorageService: FileStorageService,
  ) {}

  private async ensureUser(id: string) {
    const [existingUser] = await this.db
      .select({
        id: user.id,
      })
      .from(user)
      .where(eq(user.id, id));

    if (!existingUser) {
      throw new NotFoundException("User not found");
    }

    return true;
  }

  public async getUsers() {
    const allUsers = await this.db.select().from(user);

    return allUsers;
  }

  public async getUserById(id: string) {
    const [existingUser] = await this.db
      .select()
      .from(user)
      .where(eq(user.id, id));

    if (!existingUser) {
      throw new NotFoundException("User not found");
    }

    return existingUser;
  }

  public async updateUser(id: string, data: { email?: string }) {
    await this.ensureUser(id);

    const [updatedUser] = await this.db
      .update(user)
      .set(data)
      .where(eq(user.id, id))
      .returning();

    return updatedUser;
  }

  public async deleteUser(id: string) {
    const [deletedUser] = await this.db
      .delete(user)
      .where(eq(user.id, id))
      .returning();

    if (!deletedUser) {
      throw new NotFoundException("User not found");
    }
  }

  public async uploadUserImage(id: string, file?: Express.Multer.File) {
    if (!file || !file.buffer) {
      throw new BadRequestException("File is required");
    }

    await this.ensureUser(id);

    const key = `users/${id}/${randomUUID()}-${file.originalname}`;

    const uploadResult = await this.fileStorageService.uploadFile({
      key,
      body: file.buffer,
      contentType: file.mimetype,
      metadata: {
        originalName: file.originalname,
      },
      originalName: file.originalname,
      byteSize: file.size,
      entityRef: this.fileStorageService.generateEntityRef("user", id),
    });

    const [updatedUser] = await this.db
      .update(user)
      .set({ image: uploadResult.file.storageKey })
      .where(eq(user.id, id))
      .returning();

    return updatedUser;
  }
}
