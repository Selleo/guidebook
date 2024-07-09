import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "../auth.service";
import { Validate } from "nestjs-typebox";
import { Static } from "@sinclair/typebox";
import { createAccountSchema } from "../schemas/create-account";
import { baseResponse, BaseResponse, nullResponse } from "src/common";
import { accountSchema, accountIdSchema } from "../schemas/account";
import { Response, Request } from "express";
import {
  ACCESS_TOKEN_EXPIRATION_TIME,
  REFRESH_TOKEN_EXPIRATION_TIME,
} from "../consts";
import { refreshTokenSchema } from "../schemas/refresh-token";
import { AuthGuard } from "@nestjs/passport";
import { RefreshTokenGuard } from "src/utils/guards/refresh-token-guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @Validate({
    response: baseResponse(accountSchema),
    request: [{ type: "body", schema: createAccountSchema }],
  })
  async register(
    data: Static<typeof createAccountSchema>,
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

    console.log(refreshToken);

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
