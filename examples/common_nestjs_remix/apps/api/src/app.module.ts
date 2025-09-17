import { MiddlewareConsumer, Module } from "@nestjs/common";
import { DrizzlePostgresModule } from "@knaadh/nestjs-drizzle-postgres";
import database from "./common/configuration/database";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as schema from "./storage/schema";
import { UsersModule } from "./users/users.module";
import { JwtModule } from "@nestjs/jwt";
import jwtConfig from "./common/configuration/jwt";
import emailConfig from "./common/configuration/email";
import awsConfig from "./common/configuration/aws";
import fileStorageConfig from "./common/configuration/file-storage";
import { APP_GUARD } from "@nestjs/core";
import { EmailModule } from "./common/emails/emails.module";
import { FileStorageModule } from "./file-storage";
import { TestConfigModule } from "./test-config/test-config.module";
import { StagingGuard } from "./common/guards/staging.guard";
import { HealthModule } from "./health/health.module";
import { AuthModule } from "@thallesp/nestjs-better-auth";
import { auth } from "./lib/auth";
import { LoggerMiddleware } from "./logger/logger.middleware";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [database, jwtConfig, emailConfig, awsConfig, fileStorageConfig],
      isGlobal: true,
    }),
    DrizzlePostgresModule.registerAsync({
      tag: "DB",
      useFactory(configService: ConfigService) {
        return {
          postgres: {
            url: configService.get<string>("database.url")!,
          },
          config: {
            schema: { ...schema },
          },
        };
      },
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get<string>("jwt.secret")!,
          signOptions: {
            expiresIn: configService.get<string>("jwt.expirationTime"),
          },
        };
      },
      inject: [ConfigService],
      global: true,
    }),
    AuthModule.forRoot(auth),
    UsersModule,
    EmailModule,
    FileStorageModule,
    TestConfigModule,
    HealthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: StagingGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
