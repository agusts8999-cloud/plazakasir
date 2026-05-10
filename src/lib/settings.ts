import { db } from "./db";
import { settings } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Mendapatkan nilai setting berdasarkan key.
 * Digunakan untuk Title, Footer, API Keys, dll.
 */
export async function getSetting(key: string, defaultValue: string = ""): Promise<string> {
  try {
    const result = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
    const setting = result[0];
    return setting?.value ?? defaultValue;
  } catch (error) {
    console.error(`Error fetching setting ${key}:`, error);
    return defaultValue;
  }
}

/**
 * Mendapatkan semua setting dalam satu grup (misal: GENERAL, SEO).
 */
export async function getSettingsByGroup(group: string) {
  try {
    const results = await db.select().from(settings).where(eq(settings.group, group));
    return results.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
  } catch (error) {
    console.error(`Error fetching settings group ${group}:`, error);
    return {};
  }
}

/**
 * Helper untuk inisialisasi default settings jika kosong.
 */
export async function initDefaultSettings() {
  const defaults = [
    { key: "site_title", value: "PlazaKasir - Pusat Aplikasi UMKM", group: "GENERAL" },
    { key: "site_footer", value: "© 2026 PlazaKasir. Semua Hak Dilindungi.", group: "GENERAL" },
    { key: "medsos_instagram", value: "https://instagram.com/plazakasir", group: "API" },
    { key: "medsos_tiktok", value: "https://tiktok.com/@plazakasir", group: "API" },
  ];

  for (const s of defaults) {
     // Check if exists
     const existing = await db.select().from(settings).where(eq(settings.key, s.key)).limit(1);
     if (existing.length === 0) {
        await db.insert(settings).values(s);
     }
  }
}
