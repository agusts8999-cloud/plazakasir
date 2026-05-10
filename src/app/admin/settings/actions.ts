"use server";

import { db } from "@/lib/db";
import { settings as settingsSchema } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function updateSetting(formData: FormData) {
  try {
    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), "public/uploads");
    await mkdir(uploadDir, { recursive: true });

    // Handle Logo Upload
    const logoFile = formData.get("site_logo_file") as File;
    let logoUrl = formData.get("site_logo") as string;

    if (logoFile && logoFile.size > 0) {
      const bytes = await logoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `logo-${Date.now()}-${logoFile.name.replace(/\s+/g, "-")}`;
      const path = join(uploadDir, filename);
      await writeFile(path, buffer);
      logoUrl = `/uploads/${filename}`;
    }

    // Get all keys from formData (excluding internal Next.js ones and the file object)
    const keys = Array.from(formData.keys()).filter(k => !k.startsWith("$") && k !== "site_logo_file");
    
    // Explicitly add site_logo if not in keys (it's hidden but should be there)
    const updates = keys.map(key => ({
      key,
      value: key === "site_logo" ? logoUrl : formData.get(key) as string
    }));

    for (const s of updates) {
      if (s.value === null || s.value === undefined) continue;
      
      const existing = await db.select().from(settingsSchema).where(eq(settingsSchema.key, s.key)).limit(1);
      
      if (existing.length > 0) {
        await db.update(settingsSchema).set({ value: s.value, updatedAt: new Date() }).where(eq(settingsSchema.key, s.key));
      } else {
        await db.insert(settingsSchema).values({ key: s.key, value: s.value, group: "GENERAL" });
      }
    }
    
    revalidatePath("/");
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error) {
    console.error("Failed to update settings:", error);
    return { success: false, error: "Gagal menyimpan perubahan." };
  }
}
