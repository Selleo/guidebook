import { Provider, Type } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { DatabasePg } from "../src/common";
import { StartedTestContainer } from "testcontainers";
import { setupTestDatabase } from "./test-database";

export interface TestContext {
  module: TestingModule;
  db: DatabasePg;
  container: StartedTestContainer;
  getService: <T>(service: Type<T>) => T;
}

export async function createUnitTest(
  customProviders: Provider[] = [],
): Promise<TestContext> {
  const { db, container } = await setupTestDatabase();

  const module: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
    providers: [...customProviders],
  })
    .overrideProvider("DB")
    .useValue(db)
    .overrideProvider(JwtService)
    .useValue({
      signAsync: jest.fn(),
      verifyAsync: jest.fn(),
    })
    .compile();

  return {
    module,
    db,
    container,
    getService: <T>(service: Type<T>): T => module.get<T>(service),
  };
}
