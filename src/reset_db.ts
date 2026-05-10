import "dotenv/config";
import { db } from "./db/index";
import { sql } from "drizzle-orm";

async function reset() {
  try {
    await db.execute(sql`DROP TABLE IF EXISTS "ProductKey" CASCADE;`);
    await db.execute(sql`DROP TABLE IF EXISTS "Product" CASCADE;`);
    await db.execute(sql`DROP TABLE IF EXISTS "Setting" CASCADE;`);
    await db.execute(sql`DROP TABLE IF EXISTS "User" CASCADE;`);
    await db.execute(sql`DROP TABLE IF EXISTS "Session" CASCADE;`);
    await db.execute(sql`DROP TABLE IF EXISTS "Account" CASCADE;`);
    await db.execute(sql`DROP TABLE IF EXISTS "VerificationToken" CASCADE;`);
    console.log("Tables dropped successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Failed to drop tables:", err);
    process.exit(1);
  }
}

reset();
