import "dotenv/config";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "./db/index";

async function runMigration() {
  try {
    console.log("Running migrations...");
    await migrate(db, { migrationsFolder: "drizzle" });
    console.log("Migrations applied successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

runMigration();
