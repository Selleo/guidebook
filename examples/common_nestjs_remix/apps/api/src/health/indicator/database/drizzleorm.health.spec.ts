import { DatabasePg } from "src/common";
import { TestContext, createUnitTest } from "test/create-unit-test";
import { DrizzleOrmHealthIndicator } from "./drizzleorm.health";
import { HealthCheckError } from "@nestjs/terminus";

describe("DrizzleOrmHealthIndicator", () => {
  let testContext: TestContext;
  let drizzleOrmHealthIndicator: DrizzleOrmHealthIndicator;
  let db: DatabasePg;

  beforeAll(async () => {
    testContext = await createUnitTest();
    db = testContext.db;
    drizzleOrmHealthIndicator = new DrizzleOrmHealthIndicator(db);
  }, 30000);

  afterAll(async () => {
    await testContext.teardown();
  });

  it("should ping the database", async () => {
    const result = await drizzleOrmHealthIndicator.pingCheck("test-database");

    expect(result).toStrictEqual({
      "test-database": {
        status: "up",
      },
    });
  });

  it("should return status when failure", async () => {
    db.execute = jest.fn().mockImplementation(() => {
      throw new Error();
    });

    try {
      await drizzleOrmHealthIndicator.pingCheck("test-database");
    } catch (error) {
      expect(error).toStrictEqual(
        new HealthCheckError("Database check failed", {}),
      );
    }
  });
});
