import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { DatabasePg } from "src/common";
import { credentials, users } from "src/storage/schema";

@Injectable()
export class UsersService {
  constructor(@Inject("DB") private readonly db: DatabasePg) {}

  public async getUsers() {
    const allUsers = await this.db.select().from(users);

    return allUsers;
  }

  public async getUserById(id: string) {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  public async updateUser(id: string, data: { email?: string }) {
    const [existingUser] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id));

    if (!existingUser) {
      throw new NotFoundException("User not found");
    }

    const [updatedUser] = await this.db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();

    return updatedUser;
  }

  async changePassword(id: string, password: string) {
    const [existingUser] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id));

    if (!existingUser) {
      throw new NotFoundException("User not found");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.db
      .update(credentials)
      .set({ password: hashedPassword })
      .where(eq(credentials.userId, id));
  }

  public async deleteUser(id: string) {
    const [deletedUser] = await this.db
      .delete(users)
      .where(eq(users.id, id))
      .returning();

    if (!deletedUser) {
      throw new NotFoundException("User not found");
    }
  }
}
