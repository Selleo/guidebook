import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "src/storage/schema";

export type DatabasePg = PostgresJsDatabase<typeof schema>;
