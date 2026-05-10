"use client";

import { motion } from "framer-motion";
import { 
  Store, 
  WashingMachine, 
  Utensils, 
  Wrench, 
  Scissors, 
  Warehouse, 
  School, 
  Pill,
  Smartphone,
  ShoppingBag
} from "lucide-react";
import Link from "next/link";

const categories = [
  { name: "Kasir", icon: Store, color: "bg-blue-500" },
  { name: "Laundry", icon: WashingMachine, color: "bg-cyan-500" },
  { name: "Restoran", icon: Utensils, color: "bg-orange-500" },
  { name: "Bengkel", icon: Wrench, color: "bg-slate-500" },
  { name: "Barber", icon: Scissors, color: "bg-zinc-500" },
  { name: "Gudang", icon: Warehouse, color: "bg-indigo-500" },
  { name: "Sekolah", icon: School, color: "bg-emerald-500" },
  { name: "Apotek", icon: Pill, color: "bg-rose-500" },
];

export function Categories() {
  return (
    <section id="categories" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 tracking-tight">Kategori Software</h2>
          <p className="text-muted-foreground">Pilih aplikasi yang paling sesuai dengan jenis usaha Anda.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.name}
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/marketplace?cat=${cat.name}`}>
                <div className="group bg-background border border-border p-8 rounded-3xl flex flex-col items-center text-center transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5">
                  <div className={`w-14 h-14 rounded-2xl ${cat.color} bg-opacity-10 flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                    <cat.icon className={`text-opacity-90`} size={28} style={{ color: "var(--primary)" }} />
                  </div>
                  <h3 className="font-bold text-sm tracking-wide uppercase">{cat.name}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
