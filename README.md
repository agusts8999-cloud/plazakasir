# PLAZAKASIR.COM - Enterprise Software Marketplace for UMKM

Pusat distribusi aplikasi bisnis modern, murah, dan profesional untuk UMKM Indonesia.

## Tech Stack
- **Frontend**: Next.js 15+ (App Router), TypeScript, Tailwind CSS, Framer Motion
- **UI Components**: ShadCN UI, Lucide Icons
- **Backend**: Next.js API Routes & Server Actions
- **Database**: PostgreSQL with Prisma ORM 7+
- **Auth**: NextAuth.js (Google & Email)
- **Infrastructure**: SMTP for Emails, WhatsApp API Integration

## Fitur Utama
- **Minimalist Enterprise UI**: Desain premium dengan minim teks, fokus pada visual.
- **Product Key Protection**: Akses software dilindungi key yang didapat setelah follow medsos.
- **Control Center Admin**: Management API, SMTP, Produk (Paid/Free/Discount), dan konten website secara dinamis.
- **Marketplace System**: Grid aplikasi modern dengan filter kategori.

## Coding Flow & Architecture
Pengembangan dibagi menjadi 5 fase utama:

1. **Foundation**: Setup Next.js, ShadCN, dan Prisma Schema. (COMPLETED)
2. **Dynamic Settings**: Implementasi database `Settings` untuk Judul, Footer, dan API.
3. **High-Visual UI**: Membangun Landing Page & Marketplace dengan Framer Motion.
4. **Auth & Social Logic**: Integrasi NextAuth dan logic "Follow to Unlock".
5. **Control Center**: Pembuatan dashboard Admin untuk manajemen seluruh ekosistem.

## Environment Variables (.env)
Pastikan file `.env` diisi dengan:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Secret key untuk Auth
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: Untuk Google Login
- `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`: Untuk pengiriman email
- `WA_API_URL` & `WA_API_KEY`: Untuk integrasi WhatsApp

---
Developed by Antigravity AI for PlazaKasir.
