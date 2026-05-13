"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Eye, 
  Printer, 
  ShoppingCart, 
  User, 
  Building2, 
  Globe, 
  MapPin,
  Package,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export function MemberDetailDialog({ member }: { member: any }) {
  const [isOpen, setIsOpen] = useState(false);


  const totalSpent = member.purchases?.reduce((sum: number, p: any) => sum + Number(p.amount), 0) || 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger 
        render={
          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:bg-primary/10">
            <Eye size={14} />
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[900px] rounded-xl border-none shadow-2xl p-0 overflow-hidden bg-background">
        <div className="grid grid-cols-1 lg:grid-cols-12 h-[80vh]">
          {/* Left Panel: Profile Card & Barcode */}
          <div className="lg:col-span-4 bg-primary p-8 text-white flex flex-col justify-between overflow-y-auto thin-scrollbar">
            <div className="space-y-8">
               <div className="space-y-4">
                  <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center border border-white/30 shadow-inner">
                     <User size={32} />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold tracking-tight">{member.name}</h2>
                    <p className="text-blue-100/60 text-xs font-medium">{member.email}</p>
                  </div>
               </div>

               <div className="space-y-4 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-3 text-sm">
                     <Building2 size={16} className="text-white/40" />
                     <span className="font-medium">{member.businessName || "Personal"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                     <Globe size={16} className="text-white/40" />
                     <span className="font-medium">{member.website || "-"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                     <MapPin size={16} className="text-white/40" />
                     <span className="font-medium line-clamp-2 leading-snug">{member.address || "-"}</span>
                  </div>
               </div>
            </div>

            {/* Visual Membership Card / Barcode Section */}
            <div className="mt-12 bg-white rounded-lg p-5 text-black space-y-4 shadow-2xl">
               <div className="flex justify-between items-start">
                  <div className="w-7 h-7 bg-primary rounded flex items-center justify-center">
                     <span className="text-white font-bold text-[10px]">P</span>
                  </div>
                  <Badge className="bg-primary/5 text-primary border-none text-[8px] font-bold tracking-widest uppercase px-2 h-5">MEMBER CARD</Badge>
               </div>
               
               <div>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Registration Code</p>
                  <p className="text-base font-mono font-bold tracking-tight text-foreground">{member.code || "PK-NEW-MEMBER"}</p>
               </div>

               {/* Simulated Barcode */}
               <div className="h-8 w-full flex gap-[1.5px] items-end justify-center overflow-hidden opacity-80">
                  {[...Array(40)].map((_, i) => (
                    <div 
                      key={i} 
                      className="bg-black" 
                      style={{ 
                        width: Math.random() > 0.5 ? '1px' : '2px', 
                        height: (40 + Math.random() * 60) + '%' 
                      }} 
                    />
                  ))}
               </div>

               <Button className="w-full h-9 rounded-md bg-zinc-900 text-white hover:bg-zinc-800 gap-2 text-xs font-bold" onClick={() => window.print()}>
                  <Printer size={14} /> Cetak Kartu
               </Button>
            </div>
          </div>

          {/* Right Panel: Purchase History */}
          <div className="lg:col-span-8 p-10 overflow-y-auto thin-scrollbar bg-white">
             <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2.5 tracking-tight">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                      <ShoppingCart size={18} />
                    </div>
                    {member.isMainCompany ? "Identitas Vendor Utama" : "Riwayat Transaksi"}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1.5 font-medium">
                    {member.isMainCompany 
                      ? "Informasi profil sebagai penyedia layanan utama." 
                      : "Daftar produk dan lisensi yang dimiliki oleh anggota."}
                  </p>
                </div>
                {!member.isMainCompany && (
                  <div className="text-right">
                     <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Belanja</p>
                     <p className="text-2xl font-extrabold text-primary tracking-tighter">{formatCurrency(totalSpent)}</p>
                  </div>
                )}
             </div>

             <div className="space-y-3">
                {member.isMainCompany ? (
                  <div className="py-16 text-center border border-dashed border-amber-200 bg-amber-50/20 rounded-xl">
                     <ShieldCheck size={40} className="mx-auto text-amber-500/40 mb-4" />
                     <p className="text-amber-900 font-bold text-base">Entitas Utama (Owner)</p>
                     <p className="text-amber-700/70 text-xs max-w-sm mx-auto mt-2 px-6 leading-relaxed">
                        Akun ini memiliki hak akses penuh dan data profilnya digunakan sebagai identitas branding di seluruh platform.
                     </p>
                  </div>
                ) : member.purchases && member.purchases.length > 0 ? (
                  member.purchases.map((purchase: any) => (
                    <div key={purchase.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-lg border border-gray-100 group hover:border-blue-200 hover:bg-blue-50/10 transition-all">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-blue-500 transition-colors shadow-sm">
                             <Package size={18} />
                          </div>
                          <div>
                             <p className="font-bold text-sm text-gray-900 leading-none">{purchase.product?.name}</p>
                             <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-2">
                                <span className="font-medium">{new Date(purchase.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                <span className="opacity-30">•</span>
                                <Badge variant="outline" className="py-0 h-4.5 px-1.5 text-[9px] bg-emerald-50 text-emerald-700 border-emerald-100 font-bold">{purchase.status}</Badge>
                             </div>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="font-bold text-sm text-gray-900">{formatCurrency(purchase.amount)}</p>
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                             Invoice <ArrowRight size={10} />
                          </Button>
                       </div>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center border border-dashed border-gray-200 rounded-xl bg-gray-50/30">
                     <ShoppingCart size={32} className="mx-auto text-gray-300 mb-3" />
                     <p className="text-gray-500 text-sm font-medium">Tidak ada transaksi yang tercatat.</p>
                  </div>
                )}
             </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
