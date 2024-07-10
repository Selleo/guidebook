import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./api/auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { LocalStrategy } from "./strategy/local.strategy";
import { TokenService } from "./token.service";

@Module({
  imports: [PassportModule],
  controllers: [AuthController],
  providers: [AuthService, TokenService, JwtStrategy, LocalStrategy],
  exports: [],
})
export class AuthModule {}
