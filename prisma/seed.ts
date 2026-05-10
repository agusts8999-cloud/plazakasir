import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding data...");

  // Default Settings
  const settings = [
    { key: "site_title", value: "PlazaKasir", group: "GENERAL" },
    { key: "site_footer", value: "PlazaKasir © 2026 - Solusi Digital UMKM Indonesia", group: "GENERAL" },
    { key: "medsos_instagram", value: "https://instagram.com/plazakasir", group: "API" },
    { key: "medsos_tiktok", value: "https://tiktok.com/@plazakasir", group: "API" },
    { key: "medsos_youtube", value: "https://youtube.com/@plazakasir", group: "API" },
    { key: "medsos_facebook", value: "https://facebook.com/plazakasir", group: "API" },
    { key: "wa_number", value: "628123456789", group: "API" },
  ];

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }

  // Sample Products
  const products = [
    {
      name: "Kasir Pintar UMKM",
      description: "Aplikasi kasir ringan untuk warung dan retail kecil.",
      price: 150000,
      promoPrice: 99000,
      type: "PROMO",
      category: "Kasir",
      isActive: true,
    },
    {
      name: "Laundry Manager Pro",
      description: "Kelola antrian laundry, timbangan, dan nota otomatis.",
      price: 250000,
      type: "PAID",
      category: "Laundry",
      isActive: true,
    },
    {
      name: "Bengkel Ku",
      description: "Sistem manajemen bengkel motor dan mobil.",
      price: 0,
      type: "FREE",
      category: "Bengkel",
      isActive: true,
    },
  ];

  for (const p of products) {
    await prisma.product.create({
      data: p,
    });
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
