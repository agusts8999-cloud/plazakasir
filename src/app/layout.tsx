import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getSetting } from "@/lib/settings";
import { Providers } from "@/components/providers/Providers";
import { Toaster } from "@/components/ui/sonner";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const title = await getSetting("site_title", "PlazaKasir");
  const description = await getSetting("seo_description", "Pusat aplikasi bisnis murah untuk UMKM Indonesia.");
  const keywords = await getSetting("seo_keywords", "aplikasi kasir, software laundry, umkm digital");
  const ogImage = await getSetting("seo_og_image", "");

  return {
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description: description,
    keywords: keywords,
    openGraph: {
      title: title,
      description: description,
      images: ogImage ? [{ url: ogImage }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: ogImage ? [ogImage] : [],
    },
    robots: {
      index: true,
      follow: true,
    }
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch all layout settings
  const siteTitle = await getSetting("site_title", "PlazaKasir");
  const siteLogo = await getSetting("site_logo", "");
  const siteFooter = await getSetting("site_footer", "");
  const contactEmail = await getSetting("contact_email", "");
  const contactPhone = await getSetting("contact_phone", "");
  const contactAddress = await getSetting("contact_address", "");
  
  const promoText = await getSetting("header_promo_text", "");
  const ctaText = await getSetting("header_cta_text", "Download Gratis");
  const footerDescription = await getSetting("footer_description", "");
  
  const navLinksRaw = await getSetting("nav_links", "[]");
  let navLinks = [];
  try {
    navLinks = JSON.parse(navLinksRaw);
  } catch (e) {
    navLinks = [];
  }

  return (
    <html lang="id" className={`${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <Providers>
          <Toaster position="top-center" richColors />
          <Navbar 
            siteTitle={siteTitle} 
            siteLogo={siteLogo} 
            promoText={promoText}
            ctaText={ctaText}
            navLinks={navLinks}
          />
          <main className="flex-grow">{children}</main>
          <Footer 
            siteFooter={siteFooter} 
            footerDescription={footerDescription}
            contactEmail={contactEmail} 
            contactPhone={contactPhone} 
            contactAddress={contactAddress}
          />
        </Providers>
      </body>
    </html>
  );
}
