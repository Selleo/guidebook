import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Static } from "@sinclair/typebox";
import { Request, Response } from "express";
import { Validate } from "nestjs-typebox";
import { baseResponse, BaseResponse, nullResponse } from "src/common";
import { Public } from "src/common/decorators/public.decorator";
import { RefreshTokenGuard } from "src/common/guards/refresh-token-guard";
import { AuthService } from "../auth.service";
import {
  CreateAccountBody,
  createAccountSchema,
} from "../schemas/create-account.schema";
import { LoginBody, loginSchema } from "../schemas/login.schema";
import { TokenService } from "../token.service";
import { commonUserSchema } from "src/common/schemas/common-user.schema";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  @Public()
  @Post("register")
  @Validate({
    request: [{ type: "body", schema: createAccountSchema }],
    response: baseResponse(commonUserSchema),
  })
  async register(
    data: CreateAccountBody,
  ): Promise<BaseResponse<Static<typeof commonUserSchema>>> {
    const account = await this.authService.register(data.email, data.password);

    return new BaseResponse(account);
  }

  @Public()
  @UseGuards(AuthGuard("local"))
  @Post("login")
  @Validate({
    request: [{ type: "body", schema: loginSchema }],
    response: baseResponse(commonUserSchema),
  })
  async login(
    @Body() data: LoginBody,
    @Res({ passthrough: true }) response: Response,
  ): Promise<BaseResponse<Static<typeof commonUserSchema>>> {
    const { accessToken, refreshToken, ...account } =
      await this.authService.login(data);

    this.tokenService.setTokenCookies(response, accessToken, refreshToken);

    return new BaseResponse(account);
  }

  @Post("logout")
  @Validate({
    response: nullResponse(),
  })
  async logout(@Res({ passthrough: true }) response: Response): Promise<null> {
    this.tokenService.clearTokenCookies(response);

    return null;
  }

  @UseGuards(RefreshTokenGuard)
  @Post("refresh")
  @Validate({
    response: nullResponse(),
  })
  async refreshTokens(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ): Promise<null> {
    const refreshToken = request.cookies["refresh_token"];

    if (!refreshToken) {
      throw new UnauthorizedException("Refresh token not found");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.refreshTokens(refreshToken);

    this.tokenService.setTokenCookies(response, accessToken, newRefreshToken);

    return null;
  }
}
