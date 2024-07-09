import { TSchema, Type, FormatRegistry } from "@sinclair/typebox";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "src/storage/schema";
import { validate as uuidValidate } from "uuid";

export type DatabasePg = PostgresJsDatabase<typeof schema>;

export class BaseResponse<T> {
  data: T;

  constructor(data: T) {
    this.data = data;
  }
}

export const UUIDSchema = Type.String({ format: "uuid" });

export function baseResponse(data: TSchema) {
  if (data.type === "array") {
    return Type.Object({
      data: Type.Array(data.items),
    });
  }
  return Type.Object({
    data,
  });
}

export function nullResponse() {
  return Type.Null();
}

export function setupValidation() {
  FormatRegistry.Set("uuid", (value) => uuidValidate(value));
}
