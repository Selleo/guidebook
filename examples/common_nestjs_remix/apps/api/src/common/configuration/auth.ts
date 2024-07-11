import { registerAs } from "@nestjs/config";
import { Static, Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

const schema = Type.Object({
  refreshTokenPath: Type.String(),
});

type AuthConfig = Static<typeof schema>;

export default registerAs("auth", (): AuthConfig => {
  const values = {
    refreshTokenPath: process.env.REFRESH_TOKEN_PATH,
  };

  return Value.Decode(schema, values);
});
