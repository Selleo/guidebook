import { Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { Validate } from "nestjs-typebox";
import { baseResponse, BaseResponse } from "src/common";
import { JwtAuthGuard } from "src/utils/guards/jwt-auth-guard";
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
  @Validate({
    response: baseResponse(userSchema),
  })
  @Get(":id")
  async getUserById(
    @Param() params: { id: string },
  ): Promise<BaseResponse<UserResponse>> {
    const user = await this.usersService.getUserById(params.id);

    return new BaseResponse(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id/update")
  async updateUser(@Param() params: { id: string }, data: { email: string }) {
    const updatedUser = await this.usersService.updateUser(params.id, data);

    return updatedUser;
  }
}
