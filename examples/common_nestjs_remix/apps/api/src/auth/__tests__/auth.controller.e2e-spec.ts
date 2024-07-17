import { DatabasePg } from "../../common/index";
import { INestApplication } from "@nestjs/common";
import { isArray } from "lodash";
import request from "supertest";
import { createUserFactory } from "../../../test/factory/user.factory";
import { createE2ETest } from "../../../test/create-e2e-test";
import { AuthService } from "../auth.service";
import * as cookie from "cookie";

describe("AuthController (e2e)", () => {
  let app: INestApplication;
  let authService: AuthService;
  let db: DatabasePg;
  let userFactory: ReturnType<typeof createUserFactory>;

  beforeAll(async () => {
    const { app: testApp, getService } = await createE2ETest();
    app = testApp;
    authService = getService(AuthService);
    db = app.get("DB");
    userFactory = createUserFactory(db);
  });

  describe("POST /auth/register", () => {
    it("should register a new user", async () => {
      const user = await userFactory
        .withCredentials({ password: "password123" })
        .build();

      const response = await request(app.getHttpServer())
        .post("/auth/register")
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .send({
          email: user.email,
          password: user.credentials?.password,
        });

      expect(response.status).toEqual(201);
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data.email).toBe(user.email);
    });

    it("should return 409 if user already exists", async () => {
      const existingUser = {
        email: "existing@example.com",
        password: "password123",
      };

      await authService.register(existingUser.email, existingUser.password);

      await request(app.getHttpServer())
        .post("/auth/register")
        .send(existingUser)
        .expect(409);
    });
  });

  describe("POST /auth/login", () => {
    it("should login and return user data with cookies", async () => {
      const user = await userFactory
        .withCredentials({
          password: "password123",
        })
        .create({
          email: "test@example.com",
        });

      const response = await request(app.getHttpServer())
        .post("/auth/login")
        .send({
          email: user.email,
          password: user.credentials?.password,
        });

      expect(response.status).toEqual(201);
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data.email).toBe(user.email);
      expect(response.headers["set-cookie"]).toBeDefined();
      expect(response.headers["set-cookie"].length).toBe(2);
    });

    it("should return 401 for invalid credentials", async () => {
      await request(app.getHttpServer())
        .post("/auth/login")
        .send({
          email: "wrong@example.com",
          password: "wrongpassword",
        })
        .expect(401);
    });
  });

  describe("POST /auth/logout", () => {
    it("should clear token cookies for a logged-in user", async () => {
      let accessToken = "";

      const user = userFactory.build();
      const password = "password123";
      await authService.register(user.email, password);

      const loginResponse = await request(app.getHttpServer())
        .post("/auth/login")
        .send({
          email: user.email,
          password: password,
        })
        .expect(201);

      const cookies = loginResponse.headers["set-cookie"];

      let accessToken = "";
      let refreshToken = "";

      if (isArray(cookies)) {
        /**
         * https://www.npmjs.com/package/cookie
maybe something like this? seems usefull
         */
        cookies.forEach((cookie) => {
          if (cookie.startsWith("access_token=")) {
            accessToken = cookie;
          } else if (cookie.startsWith("refresh_token=")) {
            refreshToken = cookie;
          }
        });
      }

      const logoutResponse = await request(app.getHttpServer())
        .post("/auth/logout")
        .set("Cookie", [accessToken, refreshToken].filter(Boolean))
        .expect(201);

      expect(logoutResponse.headers["set-cookie"]).toBeDefined();
      const logoutCookies = logoutResponse.headers["set-cookie"];

      expect(logoutCookies.length).toBe(2);
      expect(logoutCookies[0]).toContain("access_token=;");
      expect(logoutCookies[1]).toContain("refresh_token=;");
    });
  });

  describe("POST /auth/refresh", () => {
    it("should refresh tokens", async () => {
      const { user } = userWithCredentialFactory.build();
      const password = "password123";
      await authService.register(user.email, password);

      const loginResponse = await request(app.getHttpServer())
        .post("/auth/login")
        .send({
          email: user.email,
          password: password,
        })
        .expect(201);

      const cookies = loginResponse.headers["set-cookie"];

      let refreshToken = "";

      if (isArray(cookies)) {
        cookies.forEach((cookie) => {
          if (cookie.startsWith("refresh_token=")) {
            refreshToken = cookie;
          }
        });
      }

      const response = await request(app.getHttpServer())
        .post("/auth/refresh")
        .set("Cookie", [refreshToken])
        .expect(201);

      expect(response.headers["set-cookie"]).toBeDefined();
      expect(response.headers["set-cookie"].length).toBe(2);
    });

    it("should return 401 for invalid refresh token", async () => {
      await request(app.getHttpServer())
        .post("/auth/refresh")
        .set("Cookie", ["refreshToken=invalid_token"])
        .expect(401);
    });
  });
});
