import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DrizzlePostgresModule } from "@knaadh/nestjs-drizzle-postgres";
import database from "./common/configuration/database";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as schema from "./storage/schema";
import { ManagementModule } from "./management/management.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [database],
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
    ManagementModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
