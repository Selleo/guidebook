import { omit } from "lodash";
import { Inject, Injectable } from "@nestjs/common";
import { eq, getTableColumns } from "drizzle-orm";
import { DatabasePg } from "src/common";
import { users } from "src/storage/schema";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(@Inject("DB") private readonly db: DatabasePg) {}

  async getUsers() {
    const allUsers = await this.db
      .select(omit(getTableColumns(users), ["password", "refreshToken"]))
      .from(users);

    return allUsers;
  }

  async getUserById(id: string) {
    const [user] = await this.db
      .select(omit(getTableColumns(users), ["password", "refreshToken"]))
      .from(users)
      .where(eq(users.id, id));

    return user;
  }

  async updateUser(id: string, data: { email: string }) {
    const [user] = await this.db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();

    const {
      password: _password,
      refreshToken: _refreshToken,
      ...updatedUser
    } = user;

    return updatedUser;
  }

  async changePassword(id: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [user] = await this.db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, id))
      .returning();

    const {
      password: _password,
      refreshToken: _refreshToken,
      ...updatedUser
    } = user;

    return updatedUser;
  }

  async deleteUser(id: string) {
    await this.db.delete(users).where(eq(users.id, id));
  }
}
