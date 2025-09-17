import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { Static } from "@sinclair/typebox";
import { FileInterceptor } from "@nestjs/platform-express";
import { Validate } from "nestjs-typebox";
import {
  baseResponse,
  BaseResponse,
  nullResponse,
  StringSchema,
  UUIDSchema,
} from "src/common";
import {
  UpdateUserBody,
  updateUserSchema,
} from "../schemas/update-user.schema";
import {
  AllUsersResponse,
  allUsersSchema,
  UserResponse,
} from "../schemas/user.schema";
import { UsersService } from "../users.service";
import { commonUserSchema } from "src/common/schemas/common-user.schema";
import { Public, Session, UserSession } from "@thallesp/nestjs-better-auth";
import { memoryStorage } from "multer";
import type { Express } from "express";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  async getProfile(@Session() session: UserSession) {
    return session;
  }

  @Get()
  @Validate({
    response: baseResponse(allUsersSchema),
  })
  async getUsers(): Promise<BaseResponse<AllUsersResponse>> {
    const users = await this.usersService.getUsers();

    return new BaseResponse(users);
  }

  @Get(":id")
  @Validate({
    request: [{ type: "param", name: "id", schema: StringSchema }],
    response: baseResponse(commonUserSchema),
  })
  async getUserById(id: string): Promise<BaseResponse<UserResponse>> {
    const user = await this.usersService.getUserById(id);

    return new BaseResponse(user);
  }

  @Post(":id/image")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  @Validate({
    response: baseResponse(commonUserSchema),
    request: [{ type: "param", name: "id", schema: StringSchema }],
  })
  @Public()
  async uploadUserImage(
    id: string,
    @UploadedFile() file: Express.Multer.File,
    // @Session() session: UserSession,
  ): Promise<BaseResponse<Static<typeof commonUserSchema>>> {
    // if (session.user.id !== id) {
    //   throw new ForbiddenException("You can only update your own account");
    // }

    const updatedUser = await this.usersService.uploadUserImage(id, file);

    return new BaseResponse(updatedUser);
  }

  @Patch(":id")
  @Validate({
    response: baseResponse(commonUserSchema),
    request: [
      { type: "param", name: "id", schema: UUIDSchema },
      { type: "body", schema: updateUserSchema },
    ],
  })
  async updateUser(
    id: string,
    @Body() data: UpdateUserBody,
    @Session() session: UserSession,
  ): Promise<BaseResponse<Static<typeof commonUserSchema>>> {
    {
      if (session.user.id !== id) {
        throw new ForbiddenException("You can only update your own account");
      }

      const updatedUser = await this.usersService.updateUser(id, data);

      return new BaseResponse(updatedUser);
    }
  }

  @Delete(":id")
  @Validate({
    response: nullResponse(),
    request: [{ type: "param", name: "id", schema: UUIDSchema }],
  })
  async deleteUser(id: string, @Session() session: UserSession): Promise<null> {
    if (session.user.id !== id) {
      throw new ForbiddenException("You can only delete your own account");
    }

    await this.usersService.deleteUser(id);

    return null;
  }
}
