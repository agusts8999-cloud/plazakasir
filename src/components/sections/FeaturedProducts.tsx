"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Monitor, Smartphone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: any;
  promoPrice: any;
  type: string;
  category: string;
  image: string | null;
}

export function FeaturedProducts({ 
  products, 
  title = "Software Unggulan", 
  subtitle = "Beberapa aplikasi paling populer yang telah membantu ribuan UMKM Indonesia." 
}: { 
  products: Product[],
  title?: string,
  subtitle?: string
}) {
  return (
    <section id="featured" className="py-32">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="text-left">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">{title}</h2>
            <p className="text-muted-foreground max-w-md">{subtitle}</p>
          </div>
          <Link href="/marketplace">
            <Button variant="link" className="text-primary font-bold group p-0">
              Lihat Semua Aplikasi <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-background border border-border rounded-xl p-5 transition-all hover:border-primary/20 hover:shadow-xl overflow-hidden">
                {/* Image Placeholder */}
                <div className="relative aspect-[4/3] bg-zinc-50 rounded-lg mb-6 overflow-hidden flex items-center justify-center border border-border/50">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="text-muted-foreground flex flex-col items-center">
                       <Monitor size={48} strokeWidth={1} className="mb-2 opacity-10" />
                       <span className="text-[10px] font-bold uppercase tracking-widest opacity-30">Preview Mockup</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {product.type === "PROMO" && <Badge className="bg-orange-500 hover:bg-orange-600 border-none font-bold">PROMO</Badge>}
                    {product.type === "FREE" && <Badge className="bg-green-500 hover:bg-green-600 border-none font-bold text-white">GRATIS</Badge>}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">{product.category}</p>
                      <h3 className="text-xl font-bold leading-tight">{product.name}</h3>
                    </div>
                    <div className="text-right">
                       {product.type === "FREE" ? (
                         <span className="text-lg font-black text-green-600">Rp 0</span>
                       ) : (
                         <>
                           {product.promoPrice ? (
                             <div className="flex flex-col items-end">
                               <span className="text-xs text-muted-foreground line-through opacity-50">Rp {Number(product.price).toLocaleString("id-ID")}</span>
                               <span className="text-lg font-black text-primary">Rp {Number(product.promoPrice).toLocaleString("id-ID")}</span>
                             </div>
                           ) : (
                             <span className="text-lg font-black text-foreground">Rp {Number(product.price).toLocaleString("id-ID")}</span>
                           )}
                         </>
                       )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                    {product.description || "Aplikasi bisnis handal untuk mengoptimalkan operasional usaha Anda."}
                  </p>

                  <div className="pt-4 flex items-center gap-2">
                    <Link href={`/marketplace/${product.id}`} className="flex-1">
                      <Button variant="outline" className="w-full rounded-md font-bold h-10 border border-border hover:bg-muted/5 transition-colors text-xs">
                        Lihat Detail
                      </Button>
                    </Link>
                    <Link href={`/marketplace/${product.id}`}>
                       <Button className="rounded-md w-10 h-10 p-0 flex items-center justify-center shadow-sm">
                          <Download size={16} />
                       </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { ArrowRight } from "lucide-react";
