import { AuthService } from "./../src/auth/auth.service";
import { Test, TestingModule } from "@nestjs/testing";
import { DatabasePg } from "src/common";
import { UsersService } from "src/users/users.service";
import { StartedTestContainer } from "testcontainers";
import { createUsersFactory } from "./factory/user.factory";
import { setupTestDatabase } from "./test-database";
import { AppModule } from "src/app.module";
import { JwtService } from "@nestjs/jwt";
import { applyFormats } from "nestjs-typebox";
import { setupValidation } from "src/utils/setup-validation";

let container: StartedTestContainer;
let usersService: UsersService;
let authService: AuthService;
let db: DatabasePg;
let userFactory: ReturnType<typeof createUsersFactory>;
let jwtService: JwtService;

beforeAll(async () => {
  applyFormats();
  setupValidation();

  const { db: database, container: pgContainer } = await setupTestDatabase();
  db = database;
  container = pgContainer;
}, 30000);

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider("DB")
    .useValue(db)
    .overrideProvider(JwtService)
    .useValue({
      signAsync: jest.fn(),
      verifyAsync: jest.fn(),
    })
    .compile();

  usersService = module.get<UsersService>(UsersService);
  authService = module.get<AuthService>(AuthService);
  jwtService = module.get<JwtService>(JwtService);
  db = module.get<DatabasePg>("DB");
  userFactory = createUsersFactory();
});

afterAll(async () => {
  if (container) {
    await container.stop();
  }
}, 30000);

export { db, userFactory, usersService, authService, jwtService };
