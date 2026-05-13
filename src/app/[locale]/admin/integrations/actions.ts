"use server";

import { db } from "@/lib/db";
import { settings as settingsSchema } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/auth";

export async function updateIntegrationSettings(formData: FormData) {
  if (!(await isAdmin())) throw new Error("Unauthorized");

  try {
    const keys = Array.from(formData.keys()).filter(k => !k.startsWith("$"));
    
    for (const key of keys) {
      const value = formData.get(key) as string;
      if (value === null) continue;

      const existing = await db.select().from(settingsSchema).where(eq(settingsSchema.key, key)).limit(1);
      
      if (existing.length > 0) {
        await db.update(settingsSchema).set({ value, updatedAt: new Date() }).where(eq(settingsSchema.key, key));
      } else {
        await db.insert(settingsSchema).values({ key, value, group: "INTEGRATION" });
      }
    }

    revalidatePath("/admin/integrations");
    return { success: true };
  } catch (err) {
    console.error("Failed to update integrations:", err);
    return { success: false, error: "Gagal menyimpan konfigurasi." };
  }
}
