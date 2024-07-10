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
import { Static, Type } from "@sinclair/typebox";
import { Request, Response } from "express";
import { Validate } from "nestjs-typebox";
import {
  baseResponse,
  BaseResponse,
  nullResponse,
  UUIDSchema,
} from "src/common";
import { CurrentUser } from "src/utils/decorators/user.decorator";
import { JwtAuthGuard } from "src/utils/guards/jwt-auth-guard";
import { RefreshTokenGuard } from "src/utils/guards/refresh-token-guard";
import { AuthService } from "../auth.service";
import { accountSchema } from "../schemas/account.schema";
import {
  CreateAccountBody,
  createAccountSchema,
} from "../schemas/create-account.schema";
import { LoginBody, loginSchema } from "../schemas/login";
import { RefreshTokenBody } from "../schemas/refresh-token";
import { TokenService } from "../token.service";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  @Post("register")
  @Validate({
    request: [{ type: "body", schema: createAccountSchema }],
    response: baseResponse(accountSchema),
  })
  async register(
    data: CreateAccountBody,
  ): Promise<BaseResponse<Static<typeof accountSchema>>> {
    const account = await this.authService.register(data.email, data.password);

    return new BaseResponse(account);
  }

  @UseGuards(AuthGuard("local"))
  @Post("login")
  @Validate({
    response: baseResponse(accountSchema),
    request: [{ type: "body", schema: createAccountSchema }],
  })
  async login(
    @Body() data: Static<typeof createAccountSchema>,
    @Res({ passthrough: true }) response: Response,
  ): Promise<BaseResponse<Static<typeof accountSchema>>> {
    const { accessToken, refreshToken, ...account } =
      await this.authService.login(data);

    response.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: ACCESS_TOKEN_EXPIRATION_TIME,
    });

    response.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: REFRESH_TOKEN_EXPIRATION_TIME,
    });

    return new BaseResponse(account);
  }

  @UseGuards(JwtAuthGuard)
  @Post("logout")
  @Validate({
    response: nullResponse(),
  })
  async logout(
    @Res({ passthrough: true }) response: Response,
    @CurrentUser() currentUser: { userId: string },
  ): Promise<null> {
    await this.authService.logout(currentUser.userId);

    response.clearCookie("access_token");
    response.clearCookie("refresh_token");

    return null;
  }

  @UseGuards(RefreshTokenGuard)
  @Post("refresh")
  @Validate({
    response: nullResponse(),
    request: [{ type: "body", schema: accountIdSchema }],
  })
  async refreshTokens(
    @Body() data: Static<typeof refreshTokenSchema>,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    const refreshToken = request.cookies["refresh_token"];

    if (!refreshToken) {
      throw new UnauthorizedException("Refresh token not found");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.refreshTokens(data.id, refreshToken);

    response.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: ACCESS_TOKEN_EXPIRATION_TIME,
    });

    response.cookie("refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: REFRESH_TOKEN_EXPIRATION_TIME,
    });

    return null;
  }
}
