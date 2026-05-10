import { Hero } from "@/components/sections/Hero";
import { Categories } from "@/components/sections/Categories";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { db } from "@/lib/db";
import { products } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSetting } from "@/lib/settings";

export default async function Home() {
  // Fetch settings for home
  const heroTitle = await getSetting("home_hero_title", "");
  const heroSubtitle = await getSetting("home_hero_subtitle", "");
  const heroButton = await getSetting("home_hero_button", "");
  const heroImage = await getSetting("home_hero_image", "");
  
  const aboutTitle = await getSetting("home_about_title", "Tentang PlazaKasir");
  const aboutContent = await getSetting("home_about_content", "Pusat distribusi aplikasi bisnis modern untuk UMKM Indonesia.");

  // Fetch products for showcase
  const featuredProducts = await db
    .select()
    .from(products)
    .where(eq(products.isActive, true))
    .limit(3)
    .orderBy(desc(products.createdAt));

  return (
    <div className="bg-background">
      <Hero 
        title={heroTitle} 
        subtitle={heroSubtitle} 
        buttonText={heroButton} 
        image={heroImage}
      />
      
      <Categories />
      
      <FeaturedProducts products={featuredProducts as any} />
      
      {/* Dynamic About Section */}
      <section id="about" className="py-24 bg-secondary/30">
         <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
               <h2 className="text-4xl font-bold mb-8">{aboutTitle}</h2>
               <div className="text-xl text-muted-foreground leading-relaxed whitespace-pre-line">
                  {aboutContent}
               </div>
            </div>
         </div>
      </section>

      {/* Community Section */}
      <section id="community" className="py-24 bg-primary text-primary-foreground overflow-hidden relative">
         <div className="absolute top-0 right-0 w-[40%] h-full bg-white/10 -skew-x-12 translate-x-1/2" />
         <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-3xl">
               <h2 className="text-4xl font-bold mb-6">Gabung Komunitas Digital UMKM</h2>
               <p className="text-xl opacity-80 mb-10">
                  Dapatkan tips bisnis, tutorial software, dan update terbaru langsung dari pakar digitalisasi.
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
    </div>
  );
}
