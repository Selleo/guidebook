import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

import * as schema from "../storage/schema";
import { buildBetterAuthInstance } from "./better-auth-options";

import "dotenv/config";

const env = (key: string) => process.env[key];

const isTest = env("NODE_ENV") === "test";
const databaseUrl = isTest ? env("DATABASE_TEST_URL") : env("DATABASE_URL");

if (!databaseUrl) {
  throw new Error("DATABASE_URL not found on .env");
}

const queryClient = postgres(databaseUrl);
const db = drizzle({ client: queryClient, schema });

export const auth = buildBetterAuthInstance({
  db,
  env,
  emailSender: async (email) => {},
});
