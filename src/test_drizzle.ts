import "dotenv/config";
import { db } from "./db/index";
import { products } from "./db/schema";

async function test() {
  try {
    const allProducts = await db.select().from(products);
    console.log("Drizzle success! Products count:", allProducts.length);
    process.exit(0);
  } catch (err) {
    console.error("Drizzle failed:", err);
    process.exit(1);
  }
}

test();
