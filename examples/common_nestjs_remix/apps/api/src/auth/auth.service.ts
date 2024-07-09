import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { eq, getTableColumns } from "drizzle-orm";
import { omit } from "lodash";
import { DatabasePg } from "src/common";
import { users } from "src/storage/schema";

@Injectable()
export class AuthService {
  constructor(
    @Inject("DB") private readonly db: DatabasePg,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string) {
    try {
      const [existingUser] = await this.db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (existingUser) {
        throw new ConflictException("User already exists");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const [newUser] = await this.db
        .insert(users)
        .values({ email, password: hashedPassword })
        .returning();

      const {
        password: _password,
        refreshToken: _refreshToken,
        ...user
      } = newUser;

      return user;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      throw new InternalServerErrorException("Error during registration");
    }
  }

  async login(data: { email: string; password: string }) {
    const user = await this.validateUser(data.email, data.password);
    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const { accessToken, refreshToken } = await this.getTokens(
      user.id,
      user.email,
    );
    await this.updateRefreshToken(user.id, refreshToken);

    return {
      ...user,
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: string) {
    try {
      await this.updateRefreshToken(userId, null);
    } catch (error) {
      throw new InternalServerErrorException("Error during logout");
    }
  }

  async refreshTokens(userId: string, refreshToken: string) {
    try {
      const [user] = await this.db
        .select()
        .from(users)
        .where(eq(users.id, userId));

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException("Invalid refresh token");
      }

      const tokens = await this.getTokens(user.id, user.email);
      await this.updateRefreshToken(user.id, tokens.refreshToken);

      return tokens;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new InternalServerErrorException("Error during token refresh");
    }
  }

  async validateUser(email: string, password: string) {
    try {
      const [user] = await this.db
        .select(omit(getTableColumns(users), ["refreshToken"]))
        .from(users)
        .where(eq(users.email, email));

      if (user && (await bcrypt.compare(password, user.password))) {
        const { password: _password, ...result } = user;
        return result;
      }

      return null;
    } catch (error) {
      throw new InternalServerErrorException("Error during user validation");
    }
  }

  private async getTokens(userId: string, email: string) {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(
          { userId, email },
          { expiresIn: "15m", secret: process.env.JWT_SECRET },
        ),
        this.jwtService.signAsync(
          { userId, email },
          { expiresIn: "7d", secret: process.env.REFRESH_SECRET },
        ),
      ]);

      return { accessToken, refreshToken };
    } catch (error) {
      throw new InternalServerErrorException("Error during token generation");
    }
  }

  private async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ) {
    try {
      await this.db
        .update(users)
        .set({ refreshToken })
        .where(eq(users.id, userId));
    } catch (error) {
      throw new InternalServerErrorException("Error during token update");
    }
  }
}
