import { SetMetadata, createParamDecorator } from "@nestjs/common";
import type { CustomDecorator, ExecutionContext } from "@nestjs/common";
import type { createAuthMiddleware } from "better-auth/api";
import { AFTER_HOOK, BEFORE_HOOK, HOOK_CLASS } from "./tokens";

export const Public = (): CustomDecorator<string> => SetMetadata("PUBLIC", true);

export const Optional = (): CustomDecorator<string> =>
  SetMetadata("OPTIONAL", true);

export const Session: ReturnType<typeof createParamDecorator> =
  createParamDecorator((_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.session;
  });

export type AuthHookContext = Parameters<
  Parameters<typeof createAuthMiddleware>[0]
>[0];

export const BeforeHook = (path: `/${string}`): CustomDecorator<symbol> =>
  SetMetadata(BEFORE_HOOK, path);

export const AfterHook = (path: `/${string}`): CustomDecorator<symbol> =>
  SetMetadata(AFTER_HOOK, path);

export const Hook = (): ClassDecorator => SetMetadata(HOOK_CLASS, true);
