import "dotenv/config";
import { db } from "./db/index";
import { sql } from "drizzle-orm";

async function check() {
  try {
    const result = await db.execute(sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'Product';`);
    console.log("Columns in Product table:");
    console.table(result);
    process.exit(0);
  } catch (err) {
    console.error("Check failed:", err);
    process.exit(1);
  }
}

check();
