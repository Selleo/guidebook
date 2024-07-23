import { registerAs } from "@nestjs/config";
import { Static, Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

const schema = Type.Object({
  SMTP_HOST: Type.String(),
  SMTP_PORT: Type.Number(),
  SMTP_USER: Type.String(),
  SMTP_PASSWORD: Type.String(),
  USE_MAILHOG: Type.Boolean(),
  EMAIL_ADAPTER: Type.Union([Type.Literal("mailhog"), Type.Literal("smtp")]),
});

export type EmailConfigSchema = Static<typeof schema>;

export default registerAs("email", (): EmailConfigSchema => {
  const values = {
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: parseInt(process.env.SMTP_PORT ?? "465", 10),
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    USE_MAILHOG: process.env.USE_MAILHOG === "true",
    EMAIL_ADAPTER: process.env.EMAIL_ADAPTER,
  };

  return Value.Decode(schema, values);
});
