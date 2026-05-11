"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download, Play } from "lucide-react";
import Link from "next/link";

interface HeroProps {
  title?: string;
  subtitle?: string;
  highlightText?: string;
  badgeText?: string;
  buttonText?: string;
  buttonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  image?: string;
}

export function Hero({ 
  title, 
  subtitle, 
  highlightText,
  badgeText,
  buttonText, 
  buttonLink,
  secondaryButtonText,
  secondaryButtonLink,
  image 
}: HeroProps) {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full -z-10 opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-blue-400 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block py-1 px-4 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-6">
            {badgeText || "Pusat Aplikasi Bisnis UMKM"}
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
            {title || "Aplikasi Bisnis Murah"} <br />
            <span className="text-primary italic">{highlightText || "Tanpa Ribet."}</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            {subtitle || "Kasir, stok, laundry, hingga restoran. Semua aplikasi yang Anda butuhkan untuk mendigitalisasi toko dalam satu klik."}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link href={buttonLink || "/marketplace"}>
              <Button size="lg" className="rounded-full px-8 h-14 text-base font-bold shadow-xl shadow-primary/20 group">
                {buttonText || "Download Gratis"} <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href={secondaryButtonLink || "#"}>
              <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base font-bold border-2">
                <Play className="mr-2 fill-current" size={16} /> {secondaryButtonText || "Lihat Demo"}
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Mockup / Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="relative rounded-3xl overflow-hidden border border-border bg-card/50 backdrop-blur-sm p-4 shadow-2xl">
            <div className="aspect-[16/9] bg-secondary rounded-2xl flex items-center justify-center overflow-hidden">
               {image ? (
                 <img src={image} alt="Hero Banner" className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full bg-gradient-to-br from-slate-900 to-primary/20 flex flex-col items-center justify-center p-12 text-center">
                    <div className="w-24 h-24 bg-primary/20 rounded-3xl flex items-center justify-center mb-6 animate-pulse">
                      <Download className="text-primary" size={48} />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-white">Interface Modern & Ringan</h3>
                    <p className="text-muted-foreground max-w-md">Dirancang khusus untuk pemilik usaha yang ingin serba cepat dan profesional.</p>
                 </div>
               )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
