import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "../globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getSetting, getAppBranding } from "@/lib/settings";
import { Providers } from "@/components/providers/Providers";
import { Toaster } from "@/components/ui/sonner";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/navigation';

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const branding = await getAppBranding();
  const title = await getSetting("site_title", branding.name || "PlazaKasir");
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
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Validate locale
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Load messages for the locale
  const messages = await getMessages();

  // Fetch all layout settings
  const branding = await getAppBranding(locale);
  const siteTitle = await getSetting("site_title", branding.name || "PlazaKasir", locale);
  const siteLogo = await getSetting("site_logo", "", locale);
  const siteFooter = await getSetting("site_footer", "", locale);
  const contactEmail = branding.email || await getSetting("contact_email", "", locale);
  const contactPhone = branding.phone || await getSetting("contact_phone", "", locale);
  const contactAddress = branding.address || await getSetting("contact_address", "", locale);
  
  const promoText = await getSetting("header_promo_text", "", locale);
  const ctaText = await getSetting("header_cta_text", "Download Gratis", locale);
  const footerDescription = await getSetting("footer_description", "", locale);
  
  const navLinksRaw = await getSetting("nav_links", "[]", locale);
  const footerSolutionsRaw = await getSetting("footer_links_solutions", "[]", locale);
  const footerResourcesRaw = await getSetting("footer_links_resources", "[]", locale);
  const footerCompanyRaw = await getSetting("footer_links_company", "[]", locale);

  const parseJson = (val: string) => {
    try { return JSON.parse(val); } catch (e) { return []; }
  };

  const navLinks = parseJson(navLinksRaw);
  const footerSolutions = parseJson(footerSolutionsRaw);
  const footerResources = parseJson(footerResourcesRaw);
  const footerCompany = parseJson(footerCompanyRaw);

  const isRTL = locale === 'ar';

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'} className={`${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <NextIntlClientProvider messages={messages} locale={locale}>
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
              solutionsLinks={footerSolutions}
              resourcesLinks={footerResources}
              companyLinks={footerCompany}
            />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
