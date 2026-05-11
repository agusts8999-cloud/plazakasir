import "dotenv/config";
import { db } from "./db/index";
import { categories, licenses } from "./db/schema";
import { eq } from "drizzle-orm";

async function seed() {
  try {
    const MASTER_BUSINESS_ID = "00000000-0000-0000-0000-000000000001";
    const cats = [
      { id: "cat-1", businessId: MASTER_BUSINESS_ID, name: "Kasir", slug: "kasir" },
      { id: "cat-2", businessId: MASTER_BUSINESS_ID, name: "Laundry", slug: "laundry" },
      { id: "cat-3", businessId: MASTER_BUSINESS_ID, name: "Restoran", slug: "restoran" },
      { id: "cat-4", businessId: MASTER_BUSINESS_ID, name: "Bengkel", slug: "bengkel" },
    ];

    for (const c of cats) {
      const existing = await db.select().from(categories).where(eq(categories.slug, c.slug)).limit(1);
      if (existing.length === 0) await db.insert(categories).values(c);
    }

    const lics = [
      { id: "lic-1", name: "Lifetime Single User", description: "Lisensi sekali beli untuk satu user." },
      { id: "lic-2", name: "Lifetime Multi User", description: "Lisensi sekali beli untuk banyak user." },
    ];

    for (const l of lics) {
      const existing = await db.select().from(licenses).where(eq(licenses.name, l.name)).limit(1);
      if (existing.length === 0) await db.insert(licenses).values(l);
    }

    console.log("Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();
