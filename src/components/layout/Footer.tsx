import Link from "next/link";
import { Instagram, Youtube, Facebook, Twitter, Mail, Phone, MapPin } from "lucide-react";

interface FooterProps {
  siteFooter: string;
  footerDescription?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
}

export function Footer({ siteFooter, footerDescription, contactEmail, contactPhone, contactAddress }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-lg font-bold tracking-tight">PlazaKasir</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              {footerDescription || "Pusat distribusi aplikasi bisnis modern untuk UMKM Indonesia. Digitalisasi toko Anda hari ini."}
            </p>
            {contactAddress && (
              <div className="flex items-start gap-2 text-xs text-muted-foreground mb-6">
                <MapPin size={14} className="mt-1 shrink-0 text-primary" />
                <span>{contactAddress}</span>
              </div>
            )}
            <div className="flex items-center gap-4">
              <Link href="#" className="p-2 bg-secondary rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
                <Instagram size={18} />
              </Link>
              <Link href="#" className="p-2 bg-secondary rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
                <Youtube size={18} />
              </Link>
              <Link href="#" className="p-2 bg-secondary rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
                <Facebook size={18} />
              </Link>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-6">Software</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/marketplace?cat=Kasir" className="hover:text-primary">Aplikasi Kasir</Link></li>
              <li><Link href="/marketplace?cat=Laundry" className="hover:text-primary">Laundry Manager</Link></li>
              <li><Link href="/marketplace?cat=Restoran" className="hover:text-primary">Restoran & Cafe</Link></li>
              <li><Link href="/marketplace?cat=Bengkel" className="hover:text-primary">Bengkel & Retail</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-6">Perusahaan</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="#about" className="hover:text-primary">Tentang Kami</Link></li>
              <li><Link href="#community" className="hover:text-primary">Komunitas</Link></li>
              <li><Link href="/blog" className="hover:text-primary">Blog & Tutorial</Link></li>
              <li><Link href="#" className="hover:text-primary">Kontak</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-6">Bantuan</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary">Pusat Bantuan</Link></li>
              <li><Link href="#" className="hover:text-primary">Syarat & Ketentuan</Link></li>
              <li><Link href="#" className="hover:text-primary">Kebijakan Privasi</Link></li>
              <li><Link href="#" className="hover:text-primary">Update Software</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-10 border-t border-border gap-6">
          <p className="text-xs text-muted-foreground">
            {siteFooter || `© ${currentYear} PlazaKasir. Semua Hak Dilindungi.`}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 text-xs text-muted-foreground">
            {contactEmail && (
              <span className="flex items-center gap-2">
                <Mail size={14} className="text-primary" /> {contactEmail}
              </span>
            )}
            {contactPhone && (
              <span className="flex items-center gap-2">
                <Phone size={14} className="text-primary" /> {contactPhone}
              </span>
            )}
            <span>Indonesia 🇮🇩</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
