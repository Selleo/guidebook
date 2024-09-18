import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { HttpModule } from "@nestjs/axios";
import { HealthController } from "./health.controller";
import { DrizzleOrmHealthIndicator } from "./indicator/database/drizzleorm.health";

@Module({
  imports: [TerminusModule, HttpModule],
  providers: [DrizzleOrmHealthIndicator],
  controllers: [HealthController],
})
export class HealthModule {}
