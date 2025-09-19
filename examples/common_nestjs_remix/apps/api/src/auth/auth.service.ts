import { Inject } from "@nestjs/common";
import type { Auth } from "better-auth";
import { AUTH_INSTANCE } from "./tokens";

export class AuthService<T extends { api: T["api"] } = Auth> {
  constructor(@Inject(AUTH_INSTANCE) private readonly auth: T) {}

  get api(): T["api"] {
    return this.auth.api;
  }

  get instance(): T {
    return this.auth;
  }
}
