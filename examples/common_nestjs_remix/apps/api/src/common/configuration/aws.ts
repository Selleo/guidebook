import { registerAs } from "@nestjs/config";
import { Static, Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

const schema = Type.Object({
  AWS_REGION: Type.String(),
  AWS_ACCESS_KEY_ID: Type.String(),
  AWS_SECRET_ACCESS_KEY: Type.String(),
});

type AWSConfigSchema = Static<typeof schema>;

export default registerAs("aws", (): AWSConfigSchema => {
  const values = {
    AWS_REGION: process.env.AWS_REGION,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  };

  return Value.Decode(schema, values);
});
