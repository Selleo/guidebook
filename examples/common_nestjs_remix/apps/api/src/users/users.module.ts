import { Module } from "@nestjs/common";
import { UsersController } from "./api/users.controller";
import { UsersService } from "./users.service";
import { FileStorageModule } from "src/file-storage";

@Module({
  imports: [FileStorageModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [],
})
export class UsersModule {}
