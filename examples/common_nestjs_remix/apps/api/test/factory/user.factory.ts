import { faker } from "@faker-js/faker";
import { InferSelectModel } from "drizzle-orm";
import { Factory } from "fishery";
import { credentials, users } from "../../src/storage/schema";

type Users = InferSelectModel<typeof users>;
type Credentials = InferSelectModel<typeof credentials>;

export function createUsersFactory() {
  return Factory.define<{ users: Users; credentials: Credentials }>(
    ({ params }) => {
      const userId = faker.string.uuid();
      const email = params.users?.email || faker.internet.email();

      const password =
        params.credentials?.password || faker.internet.password();

      const now = new Date().toISOString();

      return {
        users: {
          id: userId,
          email,
          createdAt: now,
          updatedAt: now,
        },
        credentials: {
          id: faker.string.uuid(),
          userId,
          password,
          createdAt: now,
          updatedAt: now,
        },
      };
    },
  );
}
