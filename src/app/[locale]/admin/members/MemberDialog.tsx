"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { UserPlus, Edit, Save, Loader2, Mail, Phone, Building2, Globe, MapPin, ShieldCheck, Key, User } from "lucide-react";
import { createMember, updateMember } from "./actions";
import { toast } from "sonner";

export function MemberDialog({ categories, member, mode = "add" }: { categories: any[]; member?: any; mode?: "add" | "edit" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(member?.businessCategoryId || null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const res = mode === "add" 
        ? await createMember(formData) 
        : await updateMember(member.id, formData);

      if (res.success) {
        toast.success(mode === "add" ? "Anggota berhasil ditambahkan!" : "Anggota berhasil diperbarui!");
        setIsOpen(false);
      } else {
        toast.error(res.error);
      }
    } catch (err) {
      toast.error("Kesalahan sistem.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger 
        render={
          mode === "add" ? (
            <Button className="rounded-2xl h-14 px-8 font-bold flex gap-2 shadow-lg shadow-primary/20">
              <UserPlus size={20} /> Tambah Anggota
            </Button>
          ) : (
            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:bg-primary/10">
              <Edit size={14} />
            </Button>
          )
        }
      />
      <DialogContent className="rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden sm:max-w-[1000px] w-[95vw] max-h-[95vh] flex flex-col bg-[#fcfcfd]">
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-8 text-white relative shrink-0">
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
             <UserPlus size={140} />
          </div>
          <DialogHeader className="relative z-10">
            <div className="flex items-center gap-4 mb-2">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/30 shadow-xl">
                 {mode === "add" ? <UserPlus size={28} className="text-white" /> : <User size={28} className="text-white" />}
              </div>
              <div>
                <DialogTitle className="text-2xl font-extrabold tracking-tight">
                  {mode === "add" ? "Tambah Anggota Baru" : "Update Profil Anggota"}
                </DialogTitle>
                <DialogDescription className="text-blue-100/80 font-medium">
                  {mode === "add" 
                    ? "Registrasikan anggota atau mitra bisnis baru ke dalam ekosistem PlazaKasir." 
                    : `Mengelola informasi profesional untuk ${member?.name}`}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-8 lg:p-10 thin-scrollbar">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">
              
              {/* SECTION: INFORMASI PRIBADI */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <User size={18} />
                  </div>
                  <h3 className="font-bold text-gray-800 tracking-tight uppercase text-xs">Informasi Pribadi</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-gray-500 ml-1">Nama Lengkap <span className="text-red-500">*</span></Label>
                    <div className="relative group">
                      <User className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                      <Input name="name" defaultValue={member?.name} placeholder="Contoh: Budi Santoso" className="h-12 pl-11 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-white font-medium" required />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-gray-500 ml-1">Alamat Email <span className="text-red-500">*</span></Label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                      <Input name="email" type="email" defaultValue={member?.email} placeholder="budi@email.com" className="h-12 pl-11 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-white font-medium" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-gray-500 ml-1">Nomor Telepon <span className="text-red-500">*</span></Label>
                      <div className="relative group">
                        <Phone className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <Input name="phone" defaultValue={member?.phone} placeholder="0812..." className="h-12 pl-11 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-white font-medium" required />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-gray-500 ml-1">Kode Anggota</Label>
                      <Input name="code" defaultValue={member?.code} placeholder="PK-AUTO" className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-gray-50/50 font-mono text-center uppercase" />
                    </div>
                  </div>
                </div>

                {/* AKSES LOGIN */}
                <div className="space-y-4 pt-6">
                  <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                      <Key size={18} />
                    </div>
                    <h3 className="font-bold text-gray-800 tracking-tight uppercase text-xs">Keamanan & Akses</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-gray-500 ml-1">Username</Label>
                      <Input name="username" defaultValue={member?.username} placeholder="username_login" className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-white font-medium" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-gray-500 ml-1">{mode === 'edit' ? "Ganti Password" : "Password"}</Label>
                      <Input name="password" type="password" placeholder="••••••••" className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-white" />
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100/50">
                    <div className="flex items-start gap-3">
                      <input 
                        type="checkbox" 
                        id="isMainCompany" 
                        name="isMainCompany" 
                        value="true" 
                        defaultChecked={member?.isMainCompany} 
                        className="mt-1 w-5 h-5 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                      />
                      <div>
                        <Label htmlFor="isMainCompany" className="text-sm font-bold text-amber-900 cursor-pointer flex items-center gap-2">
                           Main Company / Brand Owner
                        </Label>
                        <p className="text-[11px] text-amber-700/80 leading-relaxed mt-1">
                          Nama perusahaan ini akan digunakan sebagai identitas utama platform jika diaktifkan.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: INFORMASI USAHA */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                  <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                    <Building2 size={18} />
                  </div>
                  <h3 className="font-bold text-gray-800 tracking-tight uppercase text-xs">Informasi Bisnis</h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-gray-500 ml-1">Nama Usaha / PT</Label>
                    <div className="relative group">
                      <Building2 className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                      <Input name="businessName" defaultValue={member?.businessName} placeholder="Contoh: PT. Maju Bersama" className="h-12 pl-11 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all bg-white font-medium" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-gray-500 ml-1">Kategori Bisnis</Label>
                      <Select 
                        name="businessCategoryId" 
                        value={selectedCategory || undefined} 
                        onValueChange={(val) => setSelectedCategory(val || null)}
                      >
                        <SelectTrigger className="h-12 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 bg-white font-medium">
                          <SelectValue placeholder="Pilih Kategori" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-gray-100 shadow-2xl">
                          {categories.map((c) => (
                            <SelectItem key={c.id} value={c.id} className="rounded-lg py-3">{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-gray-500 ml-1">Website</Label>
                      <div className="relative group">
                        <Globe className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                        <Input name="website" defaultValue={member?.website} placeholder="www.usaha.com" className="h-12 pl-11 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all bg-white font-medium" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-gray-500 ml-1">Alamat Operasional</Label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                      <Textarea name="address" defaultValue={member?.address} placeholder="Jl. Raya Utama No. 123..." className="pl-11 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all bg-white min-h-[110px] py-4 font-medium" />
                    </div>
                  </div>
                </div>

                {/* KLASIFIKASI */}
                <div className="space-y-4 pt-6">
                  <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                    <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                      <ShieldCheck size={18} />
                    </div>
                    <h3 className="font-bold text-gray-800 tracking-tight uppercase text-xs">Klasifikasi & Status</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-gray-500 ml-1">Status Keanggotaan</Label>
                      <Select name="status" defaultValue={member?.status || "ACTIVE"}>
                        <SelectTrigger className="h-12 rounded-xl border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 bg-white font-bold">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-gray-100 shadow-2xl">
                          <SelectItem value="ACTIVE" className="py-3">🟢 Aktif (Active)</SelectItem>
                          <SelectItem value="INACTIVE" className="py-3">⚪ Non-Aktif (Inactive)</SelectItem>
                          <SelectItem value="SUSPENDED" className="py-3">🔴 Ditangguhkan (Suspended)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-gray-500 ml-1">Tipe Entitas</Label>
                      <Select name="type" defaultValue={member?.type || "CUSTOMER"}>
                        <SelectTrigger className="h-12 rounded-xl border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 bg-white font-bold">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-gray-100 shadow-2xl">
                          <SelectItem value="ADMIN" className="py-3">Admin (Internal)</SelectItem>
                          <SelectItem value="USER" className="py-3">Staff (Internal)</SelectItem>
                          <SelectItem value="CUSTOMER" className="py-3">Customer (External)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <DialogFooter className="p-6 lg:p-8 bg-white border-t border-gray-100 shrink-0 flex items-center justify-between gap-4">
            <p className="hidden sm:block text-[11px] text-muted-foreground italic">
              * Pastikan seluruh data yang wajib diisi telah dilengkapi dengan benar.
            </p>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1 sm:flex-none rounded-xl h-12 px-6 font-bold text-gray-600 border-gray-200 hover:bg-gray-50">
                Batalkan
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1 sm:flex-none rounded-xl h-12 px-10 font-bold gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-100">
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                {isLoading ? "Memproses..." : mode === "add" ? "Simpan Anggota" : "Perbarui Data"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
