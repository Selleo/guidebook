import { faker } from "@faker-js/faker";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { Factory } from "fishery";
// import { AuthService } from "../../src/auth/auth.service";
import { credentials, users } from "../../src/storage/schema";
import { DatabasePg } from "src/common";
import * as bcrypt from "bcrypt";

type User = InferSelectModel<typeof users>;
type UserWithCredentials = User & { credentials?: Credential };
type Credential = InferInsertModel<typeof credentials>;

export const credentialFactory = Factory.define<Credential>(() => ({
  id: faker.string.uuid(),
  userId: faker.string.uuid(),
  password: faker.internet.password(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

class UserFactory extends Factory<UserWithCredentials> {
  withCredentials(credential: { password: string }) {
    return this.associations({
      credentials: credentialFactory.build(credential),
    });
  }
}

export const createUserFactory = (db: DatabasePg) => {
  return UserFactory.define(({ onCreate, associations }) => {
    onCreate(async (user) => {
      const [inserted] = await db.insert(users).values(user).returning();

      if (associations.credentials && !associations.credentials.id) {
        const [insertedCredential] = await db
          .insert(credentials)
          .values({
            ...associations.credentials,
            password: await bcrypt.hash(associations.credentials.password, 10),
            userId: inserted.id,
          })
          .returning();

        return {
          ...inserted,
          credentials: {
            ...insertedCredential,
            password: associations.credentials.password,
          },
        };
      }

      return inserted;
    });

    return {
      id: faker.string.uuid(),
      email: faker.internet.email(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });
};

// export const userFactory = Factory.define<User>(() => ({
//   id: faker.string.uuid(),
//   email: faker.internet.email(),
//   createdAt: new Date().toISOString(),
//   updatedAt: new Date().toISOString(),
// }));
//
// export const credentialFactory = Factory.define<Credential>(() => ({
//   id: faker.string.uuid(),
//   userId: faker.string.uuid(),
//   password: faker.internet.password(),
//   createdAt: new Date().toISOString(),
//   updatedAt: new Date().toISOString(),
// }));
//
// type UserWithCredential = {
//   user: User;
//   credential: Credential;
// };
//
// export const userWithCredentialFactory = Factory.define<UserWithCredential>(
//   ({ onCreate, transientParams }) => {
//     const user = userFactory.build();
//     const credential = credentialFactory.build({ userId: user.id });
//
//     onCreate(async (user) => {
//       return authService.register(user.user.email, user.credential.password);
//     });
//
//     return {
//       user,
//       credential,
//     };
//   },
// );
