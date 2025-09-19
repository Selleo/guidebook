import {
  Inject,
  Logger,
  MiddlewareConsumer,
  Module,
  type DynamicModule,
  type ModuleMetadata,
  type NestModule,
  type OnModuleInit,
  type Provider,
  type Type,
} from "@nestjs/common";
import {
  APP_FILTER,
  DiscoveryModule,
  DiscoveryService,
  HttpAdapterHost,
  MetadataScanner,
} from "@nestjs/core";
import type { Auth } from "better-auth";
import { toNodeHandler } from "better-auth/node";
import { createAuthMiddleware } from "better-auth/plugins";
import type { Request, Response } from "express";
import { APIErrorExceptionFilter } from "./api-error-exception-filter";
import { AuthService } from "./auth.service";
import { SkipBodyParsingMiddleware } from "./skip-body-parsing.middleware";
import {
  AFTER_HOOK,
  AUTH_INSTANCE,
  AUTH_MODULE_OPTIONS,
  BEFORE_HOOK,
  HOOK_CLASS,
} from "./tokens";

export type BetterAuthModuleOptions = {
  disableExceptionFilter?: boolean;
  disableTrustedOriginsCors?: boolean;
  disableBodyParser?: boolean;
};

export interface BetterAuthModuleAsyncOptions
  extends Pick<ModuleMetadata, "imports"> {
  useFactory: (
    ...args: unknown[]
  ) =>
    | Promise<{
        auth: Auth;
        options?: BetterAuthModuleOptions;
      }>
    | {
        auth: Auth;
        options?: BetterAuthModuleOptions;
      };
  inject?: (string | symbol | Type<unknown>)[];
  useClass?: Type<{
    createAuthOptions():
      | Promise<{
          auth: Auth;
          options?: BetterAuthModuleOptions;
        }>
      | {
          auth: Auth;
          options?: BetterAuthModuleOptions;
        };
  }>;
  useExisting?: Type<{
    createAuthOptions():
      | Promise<{
          auth: Auth;
          options?: BetterAuthModuleOptions;
        }>
      | {
          auth: Auth;
          options?: BetterAuthModuleOptions;
        };
  }>;
}

const HOOK_METADATA = [
  { metadataKey: BEFORE_HOOK, hookType: "before" as const },
  { metadataKey: AFTER_HOOK, hookType: "after" as const },
];

@Module({
  imports: [DiscoveryModule],
})
export class BetterAuthModule
  implements NestModule, OnModuleInit
{
  private readonly logger = new Logger(BetterAuthModule.name);

  constructor(
    @Inject(AUTH_INSTANCE) private readonly auth: Auth,
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly adapter: HttpAdapterHost,
    @Inject(AUTH_MODULE_OPTIONS)
    private readonly options: BetterAuthModuleOptions,
  ) {}

  onModuleInit(): void {
    if (!this.auth.options.hooks) return;

    const providers = this.discoveryService
      .getProviders()
      .filter(({ metatype }) => metatype && Reflect.getMetadata(HOOK_CLASS, metatype));

    for (const provider of providers) {
      const providerPrototype = Object.getPrototypeOf(provider.instance);
      const methods = this.metadataScanner.getAllMethodNames(providerPrototype);

      for (const method of methods) {
        const providerMethod = providerPrototype[method];
        this.setupHooks(providerMethod, provider.instance);
      }
    }
  }

  configure(consumer: MiddlewareConsumer): void {
    const trustedOrigins = this.auth.options.trustedOrigins;
    const isArrayTrustedOrigins = trustedOrigins && Array.isArray(trustedOrigins);

    if (!this.options.disableTrustedOriginsCors && isArrayTrustedOrigins) {
      this.adapter.httpAdapter.enableCors({
        origin: trustedOrigins,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
      });
    } else if (
      trustedOrigins &&
      !this.options.disableTrustedOriginsCors &&
      !isArrayTrustedOrigins
    ) {
      throw new Error(
        "Function-based trustedOrigins not supported in NestJS. Use string array or disable CORS with disableTrustedOriginsCors: true.",
      );
    }

    if (!this.options.disableBodyParser) {
      consumer.apply(SkipBodyParsingMiddleware).forRoutes("*path");
    }

    let basePath = this.auth.options.basePath ?? "/api/auth";
    if (!basePath.startsWith("/")) {
      basePath = `/${basePath}`;
    }
    if (basePath.endsWith("/")) {
      basePath = basePath.slice(0, -1);
    }

    const handler = toNodeHandler(this.auth);
    this.adapter.httpAdapter
      .getInstance()
      .use(`${basePath}/*path`, (req: Request, res: Response) => handler(req, res));
    this.logger.log(`BetterAuth mounted on '${basePath}/*'`);
  }

  private setupHooks(
    providerMethod: (...args: unknown[]) => unknown,
    providerInstance: { new (...args: unknown[]): unknown } | Record<string, unknown>,
  ) {
    if (!this.auth.options.hooks) return;

    for (const { metadataKey, hookType } of HOOK_METADATA) {
      const hookPath = Reflect.getMetadata(metadataKey, providerMethod);
      if (!hookPath) continue;

      const originalHook = this.auth.options.hooks[hookType];
      this.auth.options.hooks[hookType] = createAuthMiddleware(async (ctx) => {
        if (originalHook) {
          await originalHook(ctx);
        }

        if (hookPath === ctx.path) {
          await providerMethod.apply(providerInstance, [ctx]);
        }
      });
    }
  }

  static forRoot(auth: Auth, options: BetterAuthModuleOptions = {}): DynamicModule {
    auth.options.hooks = {
      ...auth.options.hooks,
    };

    const providers: Provider[] = [
      { provide: AUTH_INSTANCE, useValue: auth },
      { provide: AUTH_MODULE_OPTIONS, useValue: options },
      AuthService,
    ];

    if (!options.disableExceptionFilter) {
      providers.push({
        provide: APP_FILTER,
        useClass: APIErrorExceptionFilter,
      });
    }

    return {
      global: true,
      module: BetterAuthModule,
      providers,
      exports: [
        { provide: AUTH_INSTANCE, useValue: auth },
        { provide: AUTH_MODULE_OPTIONS, useValue: options },
        AuthService,
      ],
    };
  }

  static forRootAsync(options: BetterAuthModuleAsyncOptions): DynamicModule {
    const asyncProviders = BetterAuthModule.createAsyncProviders(options);

    return {
      global: true,
      module: BetterAuthModule,
      imports: options.imports ?? [],
      providers: [...asyncProviders, AuthService],
      exports: [
        { provide: AUTH_INSTANCE, useExisting: AUTH_INSTANCE },
        { provide: AUTH_MODULE_OPTIONS, useExisting: AUTH_MODULE_OPTIONS },
        AuthService,
      ],
    };
  }

  private static createAsyncProviders(
    options: BetterAuthModuleAsyncOptions,
  ): Provider[] {
    if (options.useFactory) {
      return [
        {
          provide: AUTH_INSTANCE,
          useFactory: async (...args: unknown[]) => {
            const result = await options.useFactory(...args);
            const auth = result.auth;
            auth.options.hooks = {
              ...auth.options.hooks,
            };
            return auth;
          },
          inject: options.inject ?? [],
        },
        {
          provide: AUTH_MODULE_OPTIONS,
          useFactory: async (...args: unknown[]) => {
            const result = await options.useFactory(...args);
            return result.options ?? {};
          },
          inject: options.inject ?? [],
        },
        BetterAuthModule.createExceptionFilterProvider(),
      ];
    }

    if (options.useClass) {
      return [
        {
          provide: options.useClass,
          useClass: options.useClass,
        },
        {
          provide: AUTH_INSTANCE,
          useFactory: async (factory: {
            createAuthOptions():
              | Promise<{ auth: Auth; options?: BetterAuthModuleOptions }>
              | { auth: Auth; options?: BetterAuthModuleOptions };
          }) => {
            const result = await factory.createAuthOptions();
            const auth = result.auth;
            auth.options.hooks = {
              ...auth.options.hooks,
            };
            return auth;
          },
          inject: [options.useClass],
        },
        {
          provide: AUTH_MODULE_OPTIONS,
          useFactory: async (factory: {
            createAuthOptions():
              | Promise<{ auth: Auth; options?: BetterAuthModuleOptions }>
              | { auth: Auth; options?: BetterAuthModuleOptions };
          }) => {
            const result = await factory.createAuthOptions();
            return result.options ?? {};
          },
          inject: [options.useClass],
        },
        BetterAuthModule.createExceptionFilterProvider(),
      ];
    }

    if (options.useExisting) {
      return [
        {
          provide: AUTH_INSTANCE,
          useFactory: async (factory: {
            createAuthOptions():
              | Promise<{ auth: Auth; options?: BetterAuthModuleOptions }>
              | { auth: Auth; options?: BetterAuthModuleOptions };
          }) => {
            const result = await factory.createAuthOptions();
            const auth = result.auth;
            auth.options.hooks = {
              ...auth.options.hooks,
            };
            return auth;
          },
          inject: [options.useExisting],
        },
        {
          provide: AUTH_MODULE_OPTIONS,
          useFactory: async (factory: {
            createAuthOptions():
              | Promise<{ auth: Auth; options?: BetterAuthModuleOptions }>
              | { auth: Auth; options?: BetterAuthModuleOptions };
          }) => {
            const result = await factory.createAuthOptions();
            return result.options ?? {};
          },
          inject: [options.useExisting],
        },
        BetterAuthModule.createExceptionFilterProvider(),
      ];
    }

    throw new Error(
      "Invalid async configuration. Must provide useFactory, useClass, or useExisting.",
    );
  }

  private static createExceptionFilterProvider(): Provider {
    return {
      provide: APP_FILTER,
      useFactory: (options: BetterAuthModuleOptions) => {
        if (options.disableExceptionFilter) {
          return null;
        }
        return new APIErrorExceptionFilter();
      },
      inject: [AUTH_MODULE_OPTIONS],
    };
  }
}
