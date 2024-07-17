import { faker } from "@faker-js/faker";
import { InferSelectModel } from "drizzle-orm";
import { Factory } from "fishery";
import { AuthService } from "../../src/auth/auth.service";
import { credentials, users } from "../../src/storage/schema";

type User = InferSelectModel<typeof users>;
type Credential = InferSelectModel<typeof credentials>;

export const userFactory = Factory.define<User>(() => ({
  id: faker.string.uuid(),
  email: faker.internet.email(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

export const credentialFactory = Factory.define<Credential>(() => ({
  id: faker.string.uuid(),
  userId: faker.string.uuid(),
  password: faker.internet.password(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

type UserWithCredential = {
  user: User;
  credential: Credential;
};

export const userWithCredentialFactory = Factory.define<UserWithCredential>(
  ({ onCreate, transientParams }) => {
    const user = userFactory.build();
    const credential = credentialFactory.build({ userId: user.id });
    const { authService } = transientParams;

    onCreate(async (user) => {
      return authService.register(user.user.email, user.credential.password);
    });

    return {
      user,
      credential,
    };
  },
);
