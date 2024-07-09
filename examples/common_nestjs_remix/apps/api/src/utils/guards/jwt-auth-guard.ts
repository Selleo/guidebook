import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { SKIP_ACCESS_TOKEN_CHECK_KEY } from "../decorators/skip-access-token-check.decorator";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const skipCheck = this.reflector.getAllAndOverride<boolean>(
      SKIP_ACCESS_TOKEN_CHECK_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (skipCheck) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.cookies["access_token"];

    if (!token) {
      throw new UnauthorizedException("Access token not found");
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      request["user"] = payload;
      return true;
    } catch {
      throw new UnauthorizedException("Invalid access token");
    }
  }
}
