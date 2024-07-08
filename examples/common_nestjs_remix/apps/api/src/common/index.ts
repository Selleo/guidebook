import { TObject, Type } from "@sinclair/typebox";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "src/storage/schema";

export type DatabasePg = PostgresJsDatabase<typeof schema>;

export class BaseResponse<T> {
  data: T;

  constructor(data: T) {
    this.data = data;
  }
}

export const UUIDSchema = Type.String({ format: "uuid" });

export function baseResponse(data: TObject) {
  return Type.Object({
    data,
  });
}

export function nullResponse() {
  return Type.Null();
}
