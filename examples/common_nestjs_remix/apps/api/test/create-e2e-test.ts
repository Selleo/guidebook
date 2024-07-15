import { Provider, Type } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import cookieParser from "cookie-parser";
import { AppModule } from "../src/app.module";
import { setupTestDatabase } from "./test-database";

export async function createE2ETest(customProviders: Provider[] = []) {
  const { db } = await setupTestDatabase();

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
    providers: [...customProviders],
  })
    .overrideProvider("DB")
    .useValue(db)
    .compile();

  const app = moduleFixture.createNestApplication();

  app.use(cookieParser());

  await app.init();

  return {
    app,
    moduleFixture,
    db,
    getService: <T>(service: Type<T>): T => moduleFixture.get(service),
  };
}
