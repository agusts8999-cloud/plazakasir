import "dotenv/config";
import { db } from "./db/index";
import { pages } from "./db/schema";
import { eq } from "drizzle-orm";

async function seedPages() {
  try {
    const defaultPages = [
      {
        id: "page-about",
        slug: "about",
        title: "Tentang PlazaKasir",
        content: `<h2>Visi & Misi Kami</h2><p>PlazaKasir adalah pusat marketplace aplikasi bisnis yang dirancang untuk membantu UMKM Indonesia melakukan transformasi digital dengan mudah dan murah.</p><h3>Kenapa Memilih Kami?</h3><ul><li>Aplikasi Terkurasi</li><li>Lisensi Lifetime</li><li>Support Teknis Berpengalaman</li></ul>`
      },
      {
        id: "page-privacy",
        slug: "privacy-policy",
        title: "Kebijakan Privasi",
        content: `<h2>Perlindungan Data Anda</h2><p>Kami berkomitmen untuk melindungi seluruh informasi pribadi yang Anda berikan. Data Anda hanya digunakan untuk keperluan pengiriman lisensi dan peningkatan layanan.</p>`
      },
      {
        id: "page-terms",
        slug: "terms-conditions",
        title: "Syarat & Ketentuan",
        content: `<h2>Ketentuan Penggunaan</h2><p>Dengan menggunakan layanan PlazaKasir, Anda menyetujui seluruh syarat dan ketentuan yang berlaku mengenai lisensi software dan penggunaan aplikasi.</p>`
      }
    ];

    for (const p of defaultPages) {
      const existing = await db.select().from(pages).where(eq(pages.slug, p.slug)).limit(1);
      if (existing.length === 0) {
        await db.insert(pages).values(p);
      }
    }

    console.log("Pages seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seedPages();
