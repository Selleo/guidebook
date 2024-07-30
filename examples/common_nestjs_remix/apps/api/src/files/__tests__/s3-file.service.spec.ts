import { DatabasePg } from "src/common";
import { TestContext, createUnitTest } from "test/create-unit-test";
import { truncateAllTables } from "test/helpers/test-helpers";
import { S3FileService } from "../s3-file.service";
import { files } from "../../storage/schema";
import fs from "node:fs";
import { FileService } from "../file.service";

describe("S3FileService", () => {
  let testContext: TestContext;
  let s3FileService: S3FileService;
  let db: DatabasePg;

  beforeAll(async () => {
    testContext = await createUnitTest();
    s3FileService = testContext.module.get(FileService);
    db = testContext.db;
  }, 70000);

  afterAll(async () => {
    await testContext.teardown();
  });

  afterEach(async () => {
    await truncateAllTables(db);
  });

  describe("upload file", () => {
    it("should upload a file", async () => {
      const buffer = fs.readFileSync(`${__dirname}/test.txt`);
      const file = {
        buffer,
        originalname: "test.txt",
        mimetype: "text/plain",
      } as Express.Multer.File;

      const result = await s3FileService.uploadFile(file);

      const [savedFile] = await db.select().from(files).limit(1);
      console.log("savedFile", savedFile);

      expect(result.id).toBe(expect.any(String));
    });
  });
});
