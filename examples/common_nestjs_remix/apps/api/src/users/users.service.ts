import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { eq, getTableColumns } from "drizzle-orm";
import { omit } from "lodash";
import { DatabasePg } from "src/common";
import { users } from "src/storage/schema";

@Injectable()
export class UsersService {
  constructor(@Inject("DB") private readonly db: DatabasePg) {}

  async getUsers() {
    try {
      const allUsers = await this.db
        .select(omit(getTableColumns(users), ["password", "refreshToken"]))
        .from(users);

      return allUsers;
    } catch (error) {
      throw new InternalServerErrorException("Error fetching users");
    }
  }

  async getUserById(id: string) {
    try {
      const [user] = await this.db
        .select(omit(getTableColumns(users), ["password", "refreshToken"]))
        .from(users)
        .where(eq(users.id, id));

      if (!user) {
        throw new NotFoundException("User not found");
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException("Error fetching user");
    }
  }

  async updateUser(id: string, data: { email?: string }) {
    try {
      const [existingUser] = await this.db
        .select()
        .from(users)
        .where(eq(users.id, id));

      if (!existingUser) {
        throw new NotFoundException("User not found");
      }

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
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException("Error updating user");
    }
  }

  async changePassword(id: string, password: string) {
    try {
      const [existingUser] = await this.db
        .select()
        .from(users)
        .where(eq(users.id, id));

      if (!existingUser) {
        throw new NotFoundException("User not found");
      }

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
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException("Error updating password");
    }
  }

  async deleteUser(id: string) {
    const [deleted] = await this.db
      .delete(users)
      .where(eq(users.id, id))
      .returning();

    if (!deleted) {
      throw new NotFoundException("User not found");
    }
  }
}
