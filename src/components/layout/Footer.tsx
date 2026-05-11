import Link from "next/link";
import { Instagram, Youtube, Facebook, Twitter, Mail, Phone, MapPin, Globe, ChevronRight } from "lucide-react";

interface FooterProps {
  siteFooter: string;
  footerDescription?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  solutionsLinks?: any[];
  resourcesLinks?: any[];
  companyLinks?: any[];
}

export function Footer({ 
  siteFooter, 
  footerDescription, 
  contactEmail, 
  contactPhone, 
  contactAddress,
  solutionsLinks = [],
  resourcesLinks = [],
  companyLinks = []
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  // Fallback links if none provided
  const defaultSolutions = [
    { name: "Aplikasi Kasir Pro", href: "/marketplace?cat=Kasir" },
    { name: "Laundry Management", href: "/marketplace?cat=Laundry" },
    { name: "Sistem Restoran", href: "/marketplace?cat=Restoran" },
    { name: "Bengkel & Otomotif", href: "/marketplace?cat=Bengkel" },
    { name: "Manajemen Inventori", href: "/marketplace" },
  ];

  const defaultResources = [
    { name: "Pusat Bantuan", href: "#" },
    { name: "Dokumentasi API", href: "#" },
    { name: "Blog & Tutorial", href: "/blog" },
    { name: "Komunitas UMKM", href: "#" },
    { name: "Update Changelog", href: "/admin/system" },
  ];

  const defaultCompany = [
    { name: "Tentang PlazaKasir", href: "#about" },
    { name: "Karir & Budaya", href: "#" },
    { name: "Kontak Media", href: "#" },
    { name: "Syarat & Ketentuan", href: "#" },
    { name: "Kebijakan Privasi", href: "#" },
  ];

  const displaySolutions = solutionsLinks.length > 0 ? solutionsLinks : defaultSolutions;
  const displayResources = resourcesLinks.length > 0 ? resourcesLinks : defaultResources;
  const displayCompany = companyLinks.length > 0 ? companyLinks : defaultCompany;

  return (
    <footer className="bg-zinc-950 text-zinc-400 border-t border-white/5 pt-24 pb-12 overflow-hidden relative">
      {/* Decorative Gradient Background */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-24">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">PlazaKasir</span>
            </Link>
            
            <p className="text-sm leading-relaxed max-w-sm">
              {footerDescription || "Platform distribusi aplikasi bisnis terintegrasi. Membantu UMKM Indonesia bertransformasi ke era digital dengan solusi teknologi yang handal dan terjangkau."}
            </p>

            <div className="space-y-4 pt-2">
               {contactAddress && (
                 <div className="flex items-start gap-3 text-xs group">
                   <MapPin size={16} className="text-primary group-hover:scale-110 transition-transform" />
                   <span className="leading-relaxed">{contactAddress}</span>
                 </div>
               )}
               {contactEmail && (
                 <div className="flex items-center gap-3 text-xs group">
                   <Mail size={16} className="text-primary group-hover:scale-110 transition-transform" />
                   <span>{contactEmail}</span>
                 </div>
               )}
            </div>

            <div className="flex items-center gap-3">
              <Link href="#" className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all">
                <Instagram size={18} />
              </Link>
              <Link href="#" className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all">
                <Youtube size={18} />
              </Link>
              <Link href="#" className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all">
                <Facebook size={18} />
              </Link>
            </div>
          </div>

          {/* Nav Links Groups */}
          <div className="lg:col-span-2 space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Solusi Bisnis</h4>
            <ul className="space-y-4">
              {displaySolutions.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:text-primary flex items-center gap-2 group">
                    <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Sumber Daya</h4>
            <ul className="space-y-4">
              {displayResources.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:text-primary flex items-center gap-2 group">
                    <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Perusahaan</h4>
            <ul className="space-y-4">
              {displayCompany.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm hover:text-primary flex items-center gap-2 group">
                    <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6 text-[11px]">
            <p>{siteFooter || `© ${currentYear} PlazaKasir. Hak Cipta Dilindungi Undang-Undang.`}</p>
          </div>
          
          <div className="flex items-center gap-8 text-[11px] font-medium">
             <div className="flex items-center gap-2 text-zinc-500">
                <Globe size={14} />
                <span>Bahasa Indonesia (ID)</span>
             </div>
             <div className="flex items-center gap-2 text-zinc-500">
                <span>PlazaKasir - Solusi Digital Terpercaya</span>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
