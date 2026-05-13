"use client";

import { motion } from "framer-motion";
import { Heart, Coffee, ShieldCheck, Zap, Globe, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface DonationProps {
  title?: string;
  subtitle?: string;
  target?: number;
  current?: number;
  buttonText?: string;
  image?: string;
}

export function Donation({ 
  title = "Dukung Pengembangan PlazaKasir", 
  subtitle = "Bantu kami terus mengembangkan solusi digital terbaik untuk UMKM Indonesia. Setiap kontribusi Anda sangat berarti bagi kemajuan ekonomi digital.",
  target = 10000000,
  current = 2500000,
  buttonText = "Donasi Sekarang",
  image
}: DonationProps) {
  const percentage = Math.min(Math.round((current / target) * 100), 100);

  return (
    <section id="donation" className="py-24 bg-white relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-pink-50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 opacity-50 pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-600 rounded-full text-sm font-bold border border-pink-100">
                <Heart size={16} fill="currentColor" />
                <span>Open Donation</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 leading-[1.1]">
                {title}
              </h2>
              
              <p className="text-xl text-zinc-600 leading-relaxed max-w-xl">
                {subtitle}
              </p>

              {/* Progress Tracker */}
              <div className="p-8 bg-zinc-50 rounded-3xl border border-zinc-100 space-y-6">
                <div className="flex items-end justify-between">
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-zinc-500 uppercase tracking-widest">Terkumpul</span>
                    <div className="text-3xl font-black text-primary flex items-baseline gap-1">
                      <span className="text-sm font-bold">IDR</span>
                      {current.toLocaleString('id-ID')}
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="text-sm font-medium text-zinc-500 uppercase tracking-widest">Target</span>
                    <div className="text-xl font-bold text-zinc-900">
                      IDR {target.toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                   <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                      <span>Progres</span>
                      <span>{percentage}%</span>
                   </div>
                   <Progress value={percentage} className="h-3 rounded-full bg-zinc-200" />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-200/50">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border shadow-sm text-zinc-400">
                         <ShieldCheck size={16} />
                      </div>
                      <span className="text-xs font-medium">Aman & Terpercaya</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border shadow-sm text-zinc-400">
                         <Zap size={16} />
                      </div>
                      <span className="text-xs font-medium">Instan Verifikasi</span>
                   </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" className="rounded-full px-10 h-14 font-bold bg-pink-600 hover:bg-pink-700 shadow-xl shadow-pink-200">
                   {buttonText}
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-10 h-14 font-bold gap-2">
                   <Coffee size={18} /> Traktir Kopi
                </Button>
              </div>
            </motion.div>

            {/* Right: Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {image ? (
                <div className="rounded-[40px] overflow-hidden shadow-2xl border-8 border-white">
                  <img src={image} alt="Donation" className="w-full h-auto" />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4 pt-12">
                     <div className="aspect-square bg-blue-600 rounded-[32px] p-8 text-white flex flex-col justify-between shadow-xl shadow-blue-200">
                        <Globe size={32} />
                        <div>
                           <h4 className="font-bold text-lg leading-tight">Global Reach</h4>
                           <p className="text-xs opacity-70 mt-2">Membawa UMKM ke pasar internasional.</p>
                        </div>
                     </div>
                     <div className="aspect-[3/4] bg-zinc-900 rounded-[32px] p-8 text-white flex flex-col justify-between shadow-xl shadow-zinc-200">
                        <MessageCircle size={32} className="text-primary" />
                        <div>
                           <h4 className="font-bold text-lg leading-tight">Full Support</h4>
                           <p className="text-xs opacity-70 mt-2">Dukungan komunitas 24/7.</p>
                        </div>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <div className="aspect-[3/4] bg-primary rounded-[32px] p-8 text-white flex flex-col justify-between shadow-xl shadow-primary/20">
                        <Zap size={32} />
                        <div>
                           <h4 className="font-bold text-lg leading-tight">Fast Dev</h4>
                           <p className="text-xs opacity-70 mt-2">Update fitur berkala dan cepat.</p>
                        </div>
                     </div>
                     <div className="aspect-square bg-pink-500 rounded-[32px] p-8 text-white flex flex-col justify-between shadow-xl shadow-pink-200">
                        <Heart size={32} />
                        <div>
                           <h4 className="font-bold text-lg leading-tight">Community</h4>
                           <p className="text-xs opacity-70 mt-2">Dari UMKM untuk UMKM.</p>
                        </div>
                     </div>
                  </div>
                </div>
              )}
              
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-2xl border flex items-center gap-4 max-w-[240px]">
                 <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <ShieldCheck size={24} />
                 </div>
                 <div>
                    <h5 className="font-bold text-sm">Transparency</h5>
                    <p className="text-[10px] text-muted-foreground mt-1">Laporan penggunaan dana tersedia secara publik.</p>
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
