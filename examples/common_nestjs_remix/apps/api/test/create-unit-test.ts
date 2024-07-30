import { Provider } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { StartedTestContainer } from "testcontainers";
import { AppModule } from "../src/app.module";
import { DatabasePg } from "../src/common";
import { setupTestDatabase } from "./test-database";
import { EmailAdapter } from "src/common/emails/adapters/email.adapter";
import { EmailTestingAdapter } from "./helpers/test-email.adapter";
import { setupTestLocalstack } from "./test-aws";
import { StartedLocalStackContainer } from "@testcontainers/localstack";

export interface TestContext {
  module: TestingModule;
  db: DatabasePg;
  container: StartedTestContainer;
  awsContainer: StartedLocalStackContainer;
  teardown: () => Promise<void>;
}

export async function createUnitTest(
  customProviders: Provider[] = [],
): Promise<TestContext> {
  const { db, container, connectionString } = await setupTestDatabase();
  const { endpoint, container: awsContainer } = await setupTestLocalstack();

  process.env.DATABASE_URL = connectionString;
  process.env.AWS_ENDPOINT = endpoint;
  process.env.AWS_REGION = "us-east-1";
  process.env.AWS_ACCESS_KEY_ID = "2ff0700865cc5c7192db13dbb37434d5";
  process.env.AWS_SECRET_ACCESS_KEY = "23924d388c6a5720a32399e80ec191fb";
  process.env.AWS_BUCKET_NAME = "testcontainers";

  const module: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
    providers: [...customProviders],
  })
    .overrideProvider(EmailAdapter)
    .useClass(EmailTestingAdapter)
    .compile();

  const teardown = async () => {
    if (container) {
      await container.stop();
    }
    if (awsContainer) {
      await awsContainer.stop();
    }
  };

  return {
    module,
    db,
    container,
    teardown,
    awsContainer,
  };
}
