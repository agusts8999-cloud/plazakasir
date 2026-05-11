import { Hero } from "@/components/sections/Hero";
import { Categories } from "@/components/sections/Categories";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { db } from "@/lib/db";
import { products } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSetting } from "@/lib/settings";

export default async function Home() {
  // Fetch settings for home
  const heroTitle = await getSetting("home_hero_title", "Solusi Digital Terbaik untuk UMKM Indonesia");
  const heroHighlight = await getSetting("home_hero_highlight", "Tanpa Ribet.");
  const heroBadge = await getSetting("home_hero_badge", "Pusat Aplikasi Bisnis UMKM");
  const heroSubtitle = await getSetting("home_hero_subtitle", "Dapatkan berbagai aplikasi kasir dan manajemen bisnis dalam satu platform terintegrasi.");
  const heroButton = await getSetting("home_hero_button", "Mulai Sekarang");
  const heroButtonLink = await getSetting("home_hero_link", "/marketplace");
  const heroSecButton = await getSetting("home_hero_sec_button", "Lihat Demo");
  const heroSecLink = await getSetting("home_hero_sec_link", "#");
  const heroImage = await getSetting("home_hero_image", "");
  
  const featuredTitle = await getSetting("home_featured_title", "Software Unggulan");
  const featuredSubtitle = await getSetting("home_featured_subtitle", "Beberapa aplikasi paling populer yang telah membantu ribuan UMKM Indonesia.");

  const aboutTitle = await getSetting("home_about_title", "Tentang PlazaKasir");
  const aboutContent = await getSetting("home_about_content", "Pusat distribusi aplikasi bisnis modern untuk UMKM Indonesia. Digitalisasi toko Anda hari ini.");

  const communityTitle = await getSetting("home_community_title", "Gabung Komunitas Digital UMKM");
  const communitySubtitle = await getSetting("home_community_subtitle", "Dapatkan tips bisnis, tutorial software, dan update terbaru langsung dari pakar digitalisasi.");

  const sectionsOrderRaw = await getSetting("home_sections_order", '["hero", "categories", "featured", "about", "community"]');
  let sectionsOrder = ["hero", "categories", "featured", "about", "community"];
  try {
    sectionsOrder = JSON.parse(sectionsOrderRaw);
  } catch (e) {
    sectionsOrder = ["hero", "categories", "featured", "about", "community"];
  }

  // Fetch products for showcase
  const featuredProducts = await db
    .select()
    .from(products)
    .where(eq(products.isActive, true))
    .limit(3)
    .orderBy(desc(products.createdAt));

  const renderSection = (id: string) => {
    switch (id) {
      case "hero":
        return (
          <Hero 
            key="hero"
            title={heroTitle} 
            highlightText={heroHighlight}
            badgeText={heroBadge}
            subtitle={heroSubtitle} 
            buttonText={heroButton} 
            buttonLink={heroButtonLink}
            secondaryButtonText={heroSecButton}
            secondaryButtonLink={heroSecLink}
            image={heroImage}
          />
        );
      case "categories":
        return <Categories key="categories" />;
      case "featured":
        return (
          <FeaturedProducts 
            key="featured"
            products={featuredProducts as any} 
            title={featuredTitle}
            subtitle={featuredSubtitle}
          />
        );
      case "about":
        return (
          <section key="about" id="about" className="py-24 bg-zinc-50/50">
            <div className="container mx-auto px-6">
               <div className="max-w-4xl mx-auto text-center">
                  <h2 className="text-4xl font-bold mb-8 tracking-tight">{aboutTitle}</h2>
                  <div className="text-xl text-muted-foreground leading-relaxed whitespace-pre-line">
                     {aboutContent}
                  </div>
               </div>
            </div>
          </section>
        );
      case "community":
        return (
          <section key="community" id="community" className="py-24 bg-primary text-primary-foreground overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[40%] h-full bg-white/10 -skew-x-12 translate-x-1/2" />
            <div className="container mx-auto px-6 relative z-10">
               <div className="max-w-3xl">
                  <h2 className="text-4xl font-bold mb-6 tracking-tight">{communityTitle}</h2>
                  <p className="text-xl opacity-80 mb-10 leading-relaxed max-w-2xl">
                     {communitySubtitle}
                  </p>
                  <div className="flex flex-wrap gap-4">
                     <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 flex flex-col gap-2 min-w-[200px]">
                        <span className="text-3xl font-bold">5.000+</span>
                        <span className="text-sm font-medium opacity-70 uppercase tracking-widest">Member WhatsApp</span>
                     </div>
                     <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 flex flex-col gap-2 min-w-[200px]">
                        <span className="text-3xl font-bold">12.000+</span>
                        <span className="text-sm font-medium opacity-70 uppercase tracking-widest">Followers TikTok</span>
                     </div>
                  </div>
               </div>
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-background">
      {sectionsOrder.map(id => renderSection(id))}
    </div>
  );
}
