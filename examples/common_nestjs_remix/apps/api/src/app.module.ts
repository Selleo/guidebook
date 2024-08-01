import { Module } from "@nestjs/common";
import { DrizzlePostgresModule } from "@knaadh/nestjs-drizzle-postgres";
import database from "./common/configuration/database";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as schema from "./storage/schema";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { JwtModule } from "@nestjs/jwt";
import jwtConfig from "./common/configuration/jwt";
import emailConfig from "./common/configuration/email";
import awsConfig from "./common/configuration/aws";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./common/guards/jwt-auth-guard";
import { EmailModule } from "./common/emails/emails.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [database, jwtConfig, emailConfig, awsConfig],
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
            expiresIn: configService.get<string>(
              "JWT_EXPIRATION_TIME",
              "15min",
            ),
          },
        };
      },
      inject: [ConfigService],
      global: true,
    }),
    AuthModule,
    UsersModule,
    EmailModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
