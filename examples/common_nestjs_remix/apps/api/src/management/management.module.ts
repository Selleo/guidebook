import { Module } from "@nestjs/common";
import { PropertiesController } from "./api/properties.controller";
import { PropertiesService } from "./properties.service";

@Module({
  imports: [],
  controllers: [PropertiesController],
  providers: [PropertiesService],
  exports: [],
})
export class ManagementModule {}
