"use client";

import { useState } from "react";
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
import { 
  User, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Briefcase,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { registerMember } from "./actions";
import { toast } from "sonner";
import Link from "next/link";

export function RegisterForm({ categories }: { categories: any[] }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [memberData, setMemberData] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const res = await registerMember(formData);
      if (res.success) {
        setMemberData(res.data);
        setIsSuccess(true);
        toast.success("Pendaftaran Berhasil!");
      } else {
        toast.error(res.error || "Gagal melakukan pendaftaran.");
      }
    } catch (err) {
      toast.error("Kesalahan sistem.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-200">
           <CheckCircle2 size={48} />
        </div>
        <div className="space-y-4">
           <h2 className="text-3xl font-bold">Selamat Datang, {memberData?.name}!</h2>
           <p className="text-muted-foreground">Pendaftaran Anda telah berhasil. Simpan nomor anggota Anda di bawah ini:</p>
        </div>
        
        <div className="bg-secondary/50 p-8 rounded-[2rem] border-2 border-dashed border-primary/20 max-w-sm mx-auto">
           <p className="text-[10px] uppercase font-black tracking-widest text-primary mb-2">Nomor Anggota (Kode Barcode)</p>
           <p className="text-4xl font-mono font-black text-foreground tracking-tighter">
              {memberData?.code}
           </p>
        </div>

        <div className="flex flex-col gap-4">
           <Link href="/marketplace">
              <Button className="w-full h-14 rounded-2xl font-bold text-lg">Mulai Jelajahi Produk</Button>
           </Link>
           <Link href="/">
              <Button variant="ghost" className="w-full">Kembali ke Beranda</Button>
           </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Seksi 1: Data Pribadi */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-primary font-bold border-b pb-2">
           <User size={18} /> Informasi Pribadi
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input id="name" name="name" placeholder="John Doe" className="h-12 rounded-xl border-2" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Alamat Email</Label>
            <Input id="email" name="email" type="email" placeholder="john@example.com" className="h-12 rounded-xl border-2" required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Nomor Telepon / WhatsApp</Label>
          <Input id="phone" name="phone" placeholder="0812xxxx" className="h-12 rounded-xl border-2" required />
        </div>
      </div>

      {/* Seksi 2: Data Usaha */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-primary font-bold border-b pb-2">
           <Building2 size={18} /> Detail Usaha
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="businessName">Nama Usaha / Instansi</Label>
            <Input id="businessName" name="businessName" placeholder="Contoh: Toko Barokah" className="h-12 rounded-xl border-2" />
          </div>
          <div className="space-y-2">
            <Label>Kategori Usaha</Label>
            <Select name="businessCategoryId" required>
              <SelectTrigger className="h-12 rounded-xl border-2">
                <SelectValue placeholder="Pilih Kategori Usaha" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Website (Jika ada)</Label>
          <div className="relative">
            <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input id="website" name="website" placeholder="https://..." className="h-12 pl-12 rounded-xl border-2" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Alamat Lengkap</Label>
          <Textarea id="address" name="address" placeholder="Jln. Raya No. 123..." className="rounded-xl border-2 min-h-[100px]" />
        </div>
      </div>

      <div className="pt-4">
        <Button 
          type="submit" 
          disabled={isLoading} 
          className="w-full h-14 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
        >
          {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
          {isLoading ? "Memproses..." : "Daftar Sekarang"}
        </Button>
        <p className="text-center text-xs text-muted-foreground mt-4">
           Dengan mendaftar, Anda menyetujui Syarat & Ketentuan PlazaKasir.
        </p>
      </div>
    </form>
  );
}
