import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  UseGuards,
} from "@nestjs/common";
import { Static } from "@sinclair/typebox";
import { Validate } from "nestjs-typebox";
import {
  baseResponse,
  BaseResponse,
  nullResponse,
  UUIDSchema,
} from "src/common";
import { CurrentUser } from "src/utils/decorators/user.decorator";
import { JwtAuthGuard } from "src/utils/guards/jwt-auth-guard";
import {
  ChangePasswordBody,
  changePasswordSchema,
} from "../schemas/change-password";
import { UpdateUserBody, updateUserSchema } from "../schemas/update-user";
import {
  AllUsersResponse,
  allUsersSchema,
  UserResponse,
  userSchema,
} from "../schemas/user";
import { UsersService } from "../users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get("all")
  @Validate({
    response: baseResponse(allUsersSchema),
  })
  async getUsers(): Promise<BaseResponse<AllUsersResponse>> {
    const users = await this.usersService.getUsers();

    return new BaseResponse(users);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  @Validate({
    response: baseResponse(userSchema),
  })
  async getUserById(
    @Param() params: { id: string },
  ): Promise<BaseResponse<UserResponse>> {
    const user = await this.usersService.getUserById(params.id);

    return new BaseResponse(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id/update")
  @Validate({
    response: baseResponse(userSchema),
    request: [
      { type: "param", name: "id", schema: UUIDSchema },
      { type: "body", schema: updateUserSchema },
    ],
  })
  async updateUser(
    @Param("id") id: string,
    @Body() data: UpdateUserBody,
    @CurrentUser() currentUser: { userId: string },
  ): Promise<BaseResponse<Static<typeof userSchema>>> {
    {
      if (currentUser.userId !== id) {
        throw new ForbiddenException("You can only update your own account");
      }

      const updatedUser = await this.usersService.updateUser(id, data);

      return new BaseResponse(updatedUser);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id/change-password")
  @Validate({
    response: baseResponse(userSchema),
    request: [
      { type: "param", name: "id", schema: UUIDSchema },
      { type: "body", schema: changePasswordSchema },
    ],
  })
  async changePassword(
    @Param("id") id: string,
    @Body() data: ChangePasswordBody,
    @CurrentUser() currentUser: { userId: string },
  ): Promise<BaseResponse<Static<typeof userSchema>>> {
    if (currentUser.userId !== id) {
      throw new ForbiddenException("You can only update your own account");
    }
    const updatedUser = await this.usersService.changePassword(
      id,
      data.password,
    );

    return new BaseResponse(updatedUser);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  @Validate({
    response: nullResponse(),
    request: [{ type: "param", name: "id", schema: UUIDSchema }],
  })
  async deleteUser(@Param("id") id: string): Promise<null> {
    await this.usersService.deleteUser(id);

    return null;
  }
}
