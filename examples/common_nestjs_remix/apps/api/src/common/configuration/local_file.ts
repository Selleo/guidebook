import { registerAs } from "@nestjs/config";
import { Static, Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

const schema = Type.Object({
  uploadDir: Type.Optional(Type.String()),
});

type LocalFileConfig = Static<typeof schema>;

export default registerAs("localFile", (): LocalFileConfig => {
  const values = {
    uploadDir: process.env.LOCAL_UPLOAD_FOLDER,
  };

  return Value.Decode(schema, values);
});
