import { Inject, Injectable, type NestMiddleware } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";
import * as express from "express";
import type { Auth } from "better-auth";
import { AUTH_INSTANCE } from "./tokens";

@Injectable()
export class SkipBodyParsingMiddleware implements NestMiddleware {
  constructor(@Inject(AUTH_INSTANCE) private readonly auth: Auth) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const configuredBasePath = this.auth.options.basePath ?? "/api/auth";
    let normalizedBasePath = configuredBasePath.startsWith("/")
      ? configuredBasePath
      : `/${configuredBasePath}`;
    if (normalizedBasePath.endsWith("/")) {
      normalizedBasePath = normalizedBasePath.slice(0, -1);
    }

    if (req.baseUrl.startsWith(normalizedBasePath)) {
      next();
      return;
    }

    express.json()(req, res, (err) => {
      if (err) {
        next(err);
        return;
      }
      express.urlencoded({ extended: true })(req, res, next);
    });
  }
}
