import { ConflictException, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { AuthService } from "../../../src/auth/auth.service";
import { JwtService } from "@nestjs/jwt";
import { credentials, users } from "../../storage/schema";
import { DatabasePg } from "../../../src/common";
import { createUnitTest, TestContext } from "../../../test/create-unit-test";
import { createUsersFactory } from "../../../test/factory/user.factory";

describe("AuthService", () => {
  let testContext: TestContext;
  let authService: AuthService;
  let jwtService: JwtService;
  let db: DatabasePg;
  const userFactory = createUsersFactory();

  beforeAll(async () => {
    testContext = await createUnitTest();
    authService = testContext.getService(AuthService);
    jwtService = testContext.getService(JwtService);
    db = testContext.db;
  });

  afterAll(async () => {
    if (testContext.container) {
      await testContext.container.stop();
    }
    await testContext.module.close();
  });

  afterEach(async () => {
    await db.delete(credentials);
    await db.delete(users);
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      const { users: userData } = userFactory.build();
      const password = "password123";

      const result = await authService.register(userData.email, password);

      expect(result).toBeDefined();
      expect(result.email).toBe(userData.email);

      const [savedUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, userData.email));
      expect(savedUser).toBeDefined();

      const [savedCredentials] = await db
        .select()
        .from(credentials)
        .where(eq(credentials.userId, savedUser.id));
      expect(savedCredentials).toBeDefined();
      expect(await bcrypt.compare(password, savedCredentials.password)).toBe(
        true,
      );
    });

    it("should throw ConflictException if user already exists", async () => {
      const email = "existing@example.com";
      await db.insert(users).values({ email });

      await expect(authService.register(email, "password123")).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe("login", () => {
    it("should login user successfully", async () => {
      const password = "password123";
      const hashedPassword = await bcrypt.hash(password, 10);
      const { users: userData, credentials: userCredentials } =
        userFactory.build();

      const [user] = await db.insert(users).values(userData).returning();
      await db.insert(credentials).values({
        ...userCredentials,
        userId: user.id,
        password: hashedPassword,
      });

      (jwtService.signAsync as jest.Mock).mockResolvedValueOnce("access_token");
      (jwtService.signAsync as jest.Mock).mockResolvedValueOnce(
        "refresh_token",
      );

      const result = await authService.login({
        email: userData.email,
        password,
      });

      expect(result).toEqual({
        ...user,
        accessToken: "access_token",
        refreshToken: "refresh_token",
      });
      expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
    });

    it("should throw UnauthorizedException for invalid email", async () => {
      await expect(
        authService.login({
          email: "nonexistent@example.com",
          password: "password123",
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it("should throw UnauthorizedException for invalid password", async () => {
      const { users: userData, credentials: userCredentials } =
        userFactory.build();
      const [user] = await db.insert(users).values(userData).returning();
      await db.insert(credentials).values({
        ...userCredentials,
        userId: user.id,
        password: await bcrypt.hash("correctpassword", 10),
      });

      await expect(
        authService.login({
          email: userData.email,
          password: "wrongpassword",
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe("validateUser", () => {
    it("should validate user successfully", async () => {
      const email = "test@example.com";
      const password = "password123";
      const hashedPassword = await bcrypt.hash(password, 10);

      const [user] = await db.insert(users).values({ email }).returning();
      await db
        .insert(credentials)
        .values({ userId: user.id, password: hashedPassword });

      const result = await authService.validateUser(email, password);

      expect(result).toBeDefined();
      expect(result!.email).toBe(email);
    });

    it("should return null for invalid credentials", async () => {
      const email = "test@example.com";
      const password = "password123";

      const result = await authService.validateUser(email, password);

      expect(result).toBeNull();
    });
  });
});
