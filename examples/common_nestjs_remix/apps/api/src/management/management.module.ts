import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import {
  CreatePropertyController,
  CreatePropertyHandler,
} from "./use-cases/create-property";

@Module({
  imports: [CqrsModule],
  controllers: [CreatePropertyController],
  providers: [CreatePropertyHandler],
})
export class ManagementModule {}
