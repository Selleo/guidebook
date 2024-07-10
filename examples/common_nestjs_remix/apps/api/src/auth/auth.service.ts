import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { DatabasePg } from "src/common";
import { credentials, users } from "src/storage/schema";

@Injectable()
export class AuthService {
  constructor(
    @Inject("DB") private readonly db: DatabasePg,
    private jwtService: JwtService,
  ) {}

  public async register(email: string, password: string) {
    const [existingUser] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser) {
      throw new ConflictException("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.db.transaction(async (trx) => {
      const [newUser] = await trx.insert(users).values({ email }).returning();

      await trx
        .insert(credentials)
        .values({ userId: newUser.id, password: hashedPassword });

      return newUser;
    });
  }

  public async login(data: { email: string; password: string }) {
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

  public async logout(userId: string) {
    await this.updateRefreshToken(userId, null);
  }

  public async refreshTokens(userId: string, refreshToken: string) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    const [userCredentials] = await this.db
      .select()
      .from(credentials)
      .where(eq(credentials.userId, userId));

    if (!userCredentials || userCredentials.refreshToken !== refreshToken) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    try {
      await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.REFRESH_SECRET,
      });
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  public async validateUser(email: string, password: string) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (!user) return null;

    const [userCredentials] = await this.db
      .select()
      .from(credentials)
      .where(eq(credentials.userId, user.id));

    if (!userCredentials) return null;

    const isPasswordValid = await bcrypt.compare(
      password,
      userCredentials.password,
    );

    if (!isPasswordValid) return null;

    return user;
  }

  private async getTokens(userId: string, email: string) {
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
  }

  private async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ) {
    await this.db
      .update(credentials)
      .set({ refreshToken })
      .where(eq(credentials.userId, userId));
  }
}
