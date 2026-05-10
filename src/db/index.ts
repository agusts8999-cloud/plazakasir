import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!.split("?")[0];

/**
 * Cache the database connection in development to prevent 
 * "too many clients" error due to hot reloading.
 */
const globalForDb = global as unknown as {
  client: postgres.Sql | undefined;
};

export const client = globalForDb.client ?? postgres(connectionString, { prepare: false });

if (process.env.NODE_ENV !== "production") globalForDb.client = client;

export const db = drizzle(client, { schema });
