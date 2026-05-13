"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { Plus, Edit, Save, Info, Cpu, ListChecks, Rocket } from "lucide-react";
import { createProduct, updateProduct } from "@/app/[locale]/admin/products/actions";

interface ProductDialogProps {
  product?: any;
  mode: "add" | "edit";
  categories: any[];
  licenses: any[];
  releaseInfos: any[];
}

export function ProductDialog({ product, mode, categories, licenses, releaseInfos }: ProductDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Controlled states for Selects to fix "random code" issue
  const [status, setStatus] = useState(product?.status || "LAUNCHED");
  const [releaseInfoId, setReleaseInfoId] = useState(product?.releaseInfoId || "");
  const [categoryId, setCategoryId] = useState(product?.categoryId || "");
  const [licenseId, setLicenseId] = useState(product?.licenseId || "");
  
  // Parse decimal from DB to integer string for display
  const initialPrice = product?.price ? Math.floor(Number(product.price)).toString() : "";
  const initialPromoPrice = product?.promoPrice ? Math.floor(Number(product.promoPrice)).toString() : "";

  const [priceDisplay, setPriceDisplay] = useState(initialPrice);
  const [promoPriceDisplay, setPromoPriceDisplay] = useState(initialPromoPrice);

  const formatThousand = (val: string) => {
    const num = val.replace(/\D/g, "");
    return num ? new Intl.NumberFormat("id-ID").format(Number(num)) : "";
  };

  const handlePriceChange = (setter: any) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    setter(formatThousand(rawValue));
  };

  const featuresString = product?.features?.map((f: any) => f.name).join(", ") || "";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      if (mode === "add") {
        await createProduct(formData);
      } else {
        await updateProduct(product.id, formData);
      }
      setIsOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger 
        render={
          <Button 
            variant={mode === "add" ? "default" : "ghost"}
            size={mode === "add" ? "lg" : "icon"}
            className={cn(
              mode === "add" ? "rounded-2xl h-14 px-8 font-bold flex gap-2 shadow-lg shadow-primary/20" : "rounded-xl"
            )}
          >
            {mode === "add" ? (
              <>
                <Plus size={20} /> Tambah Produk Baru
              </>
            ) : (
              <Edit size={16} />
            )}
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[800px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="bg-primary p-8 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {mode === "add" ? "Tambah Produk Baru" : "Edit Produk"}
              </DialogTitle>
              <DialogDescription className="text-white/70">
                Lengkapi seluruh detail spesifikasi dan fitur aplikasi.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto thin-scrollbar">
            {/* Bagian 0: Status Peluncuran */}
            <div className="bg-secondary/30 p-6 rounded-3xl space-y-6">
               <div className="flex items-center gap-2 text-primary font-bold">
                  <Rocket size={18} /> Status Peluncuran
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Status Produk</Label>
                    <Select name="status" value={status} onValueChange={setStatus}>
                      <SelectTrigger className="h-12 rounded-xl border-2 bg-background">
                        <SelectValue placeholder="Status">
                           {status === "LAUNCHED" ? "Sudah Launching (Live)" : "Coming Soon (Arahkan ke Info)"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="LAUNCHED">Sudah Launching (Live)</SelectItem>
                        <SelectItem value="COMING_SOON">Coming Soon (Arahkan ke Info)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Pilih Info Rilis (Jika Coming Soon)</Label>
                    <Select name="releaseInfoId" value={releaseInfoId} onValueChange={(val) => setReleaseInfoId(val || "")}>
                      <SelectTrigger className="h-12 rounded-xl border-2 bg-background">
                        <SelectValue placeholder="Pilih Info Master Data">
                           {releaseInfos.find(i => i.id === releaseInfoId)?.title}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="none">Tanpa Info</SelectItem>
                        {releaseInfos.map(info => (
                          <SelectItem key={info.id} value={info.id}>{info.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
               </div>
            </div>

            {/* Bagian 1: Informasi Dasar */}
            <div className="space-y-6">
               <div className="flex items-center gap-2 text-primary font-bold border-b pb-2">
                  <Info size={18} /> Informasi Dasar
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Aplikasi</Label>
                    <Input id="name" name="name" defaultValue={product?.name} placeholder="Contoh: Kasir Pintar Pro" className="h-12 rounded-xl border-2" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU / Barcode (Kosongkan untuk auto-generate)</Label>
                    <Input id="sku" name="sku" defaultValue={product?.sku} placeholder="PK-XXXX" className="h-12 rounded-xl border-2" />
                  </div>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <Label>Kategori</Label>
                    <Select name="categoryId" value={categoryId} onValueChange={(val) => setCategoryId(val || "")}>
                      <SelectTrigger className="h-12 rounded-xl border-2 bg-background">
                        <SelectValue placeholder="Pilih Kategori">
                           {categories.find(c => c.id === categoryId)?.name}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Lisensi</Label>
                    <Select name="licenseId" value={licenseId} onValueChange={(val) => setLicenseId(val || "")}>
                      <SelectTrigger className="h-12 rounded-xl border-2 bg-background">
                        <SelectValue placeholder="Pilih Lisensi">
                           {licenses.find(l => l.id === licenseId)?.name}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {licenses.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Versi</Label>
                    <Input name="version" defaultValue={product?.version} placeholder="1.0.0" className="h-12 rounded-xl border-2" />
                  </div>
                  <div className="space-y-2">
                    <Label>Support</Label>
                    <Select name="supportStatus" defaultValue={product?.supportStatus || "ACTIVE"}>
                      <SelectTrigger className="h-12 rounded-xl border-2">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="ACTIVE">Aktif (Update)</SelectItem>
                        <SelectItem value="EOL">End of Life</SelectItem>
                        <SelectItem value="BETA">Beta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipe Produk</Label>
                    <Select name="type" defaultValue={product?.type || "PAID"}>
                      <SelectTrigger className="h-12 rounded-xl border-2">
                        <SelectValue placeholder="Pilih Tipe" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="PAID">Berbayar (Normal)</SelectItem>
                        <SelectItem value="FREE">Gratis (Free)</SelectItem>
                        <SelectItem value="PROMO">Promo (Discount)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tanggal Rilis</Label>
                    <Input name="releaseDate" type="date" defaultValue={product?.releaseDate ? new Date(product.releaseDate).toISOString().split('T')[0] : ""} className="h-12 rounded-xl border-2" />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="price">Harga Normal (Rp)</Label>
                    <div className="relative">
                      <Input 
                        id="price_display" 
                        value={formatThousand(priceDisplay)} 
                        onChange={handlePriceChange(setPriceDisplay)}
                        placeholder="0" 
                        className="h-12 rounded-xl border-2 text-right font-mono font-bold pr-4" 
                        required 
                      />
                      <input type="hidden" name="price" value={priceDisplay.replace(/\D/g, "")} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="promoPrice">Harga Promo (Opsional)</Label>
                    <div className="relative">
                      <Input 
                        id="promoPrice_display" 
                        value={formatThousand(promoPriceDisplay)} 
                        onChange={handlePriceChange(setPromoPriceDisplay)}
                        placeholder="0" 
                        className="h-12 rounded-xl border-2 text-right font-mono font-bold pr-4" 
                      />
                      <input type="hidden" name="promoPrice" value={promoPriceDisplay.replace(/\D/g, "")} />
                    </div>
                  </div>
               </div>
            </div>

            {/* Bagian 2: Persyaratan Sistem */}
            <div className="space-y-6">
               <div className="flex items-center gap-2 text-primary font-bold border-b pb-2">
                  <Cpu size={18} /> Persyaratan Sistem
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label>OS</Label>
                    <Input name="req_os" defaultValue={product?.requirements?.os} placeholder="Windows 10+" className="h-12 rounded-xl border-2" />
                  </div>
                  <div className="space-y-2">
                    <Label>RAM</Label>
                    <Input name="req_ram" defaultValue={product?.requirements?.ram} placeholder="2GB+" className="h-12 rounded-xl border-2" />
                  </div>
                  <div className="space-y-2">
                    <Label>Storage</Label>
                    <Input name="req_storage" defaultValue={product?.requirements?.storage} placeholder="500MB+" className="h-12 rounded-xl border-2" />
                  </div>
               </div>
            </div>

            {/* Bagian 3: Fitur Unggulan */}
            <div className="space-y-6">
               <div className="flex items-center gap-2 text-primary font-bold border-b pb-2">
                  <ListChecks size={18} /> Fitur Unggulan
               </div>
               <div className="space-y-2">
                  <Label>Fitur (Pisahkan dengan koma)</Label>
                  <Textarea name="features_raw" defaultValue={featuresString} placeholder="Support Printer Thermal, Multi User, Laporan Stok, dll..." className="rounded-xl border-2 min-h-[100px]" />
               </div>
            </div>

            {/* Bagian 4: File & Media */}
            <div className="space-y-6">
               <div className="flex items-center gap-2 text-primary font-bold border-b pb-2">
                  <Plus size={18} /> File & Media
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Upload Gambar Mockup</Label>
                    <Input type="file" name="image_file" accept="image/*" className="h-12 rounded-xl border-2 pt-2" />
                  </div>
                  <div className="space-y-2">
                    <Label>Link YouTube Demo</Label>
                    <Input name="youtubeUrl" defaultValue={product?.youtubeUrl} placeholder="https://youtube.com/..." className="h-12 rounded-xl border-2" />
                  </div>
               </div>
               <div className="space-y-2">
                  <Label>Upload File Installer (.zip/.exe)</Label>
                  <Input type="file" name="download_file" className="h-12 rounded-xl border-2 pt-2" />
               </div>
            </div>
          </div>

          <DialogFooter className="p-8 pt-0">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="rounded-xl h-12">Batal</Button>
            <Button type="submit" disabled={isLoading} className="rounded-xl h-12 px-8 font-bold gap-2">
              <Save size={18} /> {isLoading ? "Menyimpan..." : "Simpan Produk"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
