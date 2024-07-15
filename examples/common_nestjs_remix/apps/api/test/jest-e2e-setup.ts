import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "../src/app.module";
import { setupValidation } from "../src/utils/setup-validation";
import cookieParser from "cookie-parser";
import { AuthService } from "../src/auth/auth.service";
import { createUsersFactory } from "./factory/user.factory";
import { applyFormats } from "nestjs-typebox";
import { closeTestDatabase, setupTestDatabase } from "./test-database";
import { UsersService } from "src/users/users.service";

let app: INestApplication;
let authService: AuthService;
let usersService: UsersService;
let userFactory: ReturnType<typeof createUsersFactory>;

beforeAll(async () => {
  const { db } = await setupTestDatabase();

  applyFormats();
  setupValidation();

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider("DB")
    .useValue(db)
    .compile();

  app = moduleFixture.createNestApplication();

  app.use(cookieParser());

  await app.init();

  authService = moduleFixture.get<AuthService>(AuthService);
  usersService = moduleFixture.get<UsersService>(UsersService);

  userFactory = createUsersFactory();
}, 30000);

afterAll(async () => {
  await closeTestDatabase();
});

export { app, authService, userFactory, usersService };
