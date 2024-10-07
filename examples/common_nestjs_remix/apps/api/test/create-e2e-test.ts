import { Provider } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import cookieParser from "cookie-parser";
import { AppModule } from "../src/app.module";
import { setupTestDatabase } from "./test-database";
import { setupTestLocalstack } from "./test-aws";

export async function createE2ETest(customProviders: Provider[] = []) {
  const { db, connectionString } = await setupTestDatabase();
  const { endpoint } = await setupTestLocalstack();

  process.env.DATABASE_URL = connectionString;
  process.env.AWS_ENDPOINT = endpoint;
  process.env.AWS_REGION = "eu-central-1";
  process.env.AWS_ACCESS_KEY_ID = "2ff0700865cc5c7192db13dbb37434d5";
  process.env.AWS_SECRET_ACCESS_KEY = "23924d388c6a5720a32399e80ec191fb";
  process.env.AWS_BUCKET_NAME = "testcontainers";

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
    providers: [...customProviders],
  }).compile();

  const app = moduleFixture.createNestApplication();

  app.use(cookieParser());

  await app.init();

  return {
    app,
    moduleFixture,
    db,
  };
}
