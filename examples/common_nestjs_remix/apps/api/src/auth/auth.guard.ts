import { Inject, Injectable } from "@nestjs/common";
import type { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Auth } from "better-auth";
import { APIError, type getSession } from "better-auth/api";
import { fromNodeHeaders } from "better-auth/node";
import { AUTH_INSTANCE } from "./tokens";

export type UserSession = NonNullable<
  Awaited<ReturnType<ReturnType<typeof getSession>>>
>;

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(Reflector) private readonly reflector: Reflector,
    @Inject(AUTH_INSTANCE) private readonly auth: Auth,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const session = await this.auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    request.session = session;
    request.user = session?.user ?? null;

    const isPublic = this.reflector.getAllAndOverride<boolean>("PUBLIC", [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const isOptional = this.reflector.getAllAndOverride<boolean>("OPTIONAL", [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isOptional && !session) return true;

    if (!session) {
      throw new APIError(401, {
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      });
    }

    return true;
  }
}
