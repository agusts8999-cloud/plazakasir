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
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { deleteCategory, deleteLicense, deleteReleaseInfo } from "@/app/[locale]/admin/master/actions";
import { toast } from "sonner";

interface MasterDataDeleteButtonProps {
  id: string;
  name: string;
  type: "category" | "license" | "releaseInfo";
  variant?: "icon" | "full";
  onSuccess?: () => void;
}

export function MasterDataDeleteButton({ id, name, type, variant = "icon", onSuccess }: MasterDataDeleteButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getTypeName = () => {
    if (type === "category") return "Kategori";
    if (type === "license") return "Lisensi";
    return "Info Rilis";
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      let res;
      if (type === "category") res = await deleteCategory(id);
      else if (type === "license") res = await deleteLicense(id);
      else res = await deleteReleaseInfo(id);

      if (res.success) {
        toast.success(`${getTypeName()} berhasil dihapus.`);
        setIsOpen(false);
        if (onSuccess) onSuccess();
      } else {
        toast.error(res.error);
      }
    } catch (err) {
      toast.error("Kesalahan sistem saat menghapus.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger 
        render={
          variant === "icon" ? (
            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:bg-red-50 text-red-500">
              <Trash2 size={14} />
            </Button>
          ) : (
            <Button type="button" variant="ghost" className="rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 mr-auto font-bold">
              <Trash2 size={18} className="mr-2" /> Hapus
            </Button>
          )
        }
      />
      <DialogContent className="rounded-[2.5rem] border-none shadow-2xl p-8 max-w-sm">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-100">
            <AlertTriangle size={32} />
          </div>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Hapus {getTypeName()}?</DialogTitle>
            <DialogDescription className="space-y-4 pt-2">
              <p>Apakah Anda yakin ingin menghapus <span className="font-bold text-foreground">{name}</span>?</p>
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-[11px] text-amber-800 leading-relaxed text-left space-y-2">
                 <p className="font-bold uppercase tracking-widest flex items-center gap-2">
                    <AlertTriangle size={12} /> Resiko Penghapusan:
                 </p>
                 <ul className="list-disc pl-4 space-y-1">
                    <li>{getTypeName()} ini tidak akan tersedia lagi untuk dipilih pada produk baru.</li>
                    <li>Data ini akan disembunyikan dari seluruh daftar filter aktif.</li>
                    <li>**Produk yang sudah menggunakan {getTypeName()} ini tetap aman** dan tidak akan error.</li>
                 </ul>
              </div>
            </DialogDescription>
          </DialogHeader>
        </div>
        <DialogFooter className="grid grid-cols-2 gap-4 mt-6">
          <Button variant="ghost" onClick={() => setIsOpen(false)} className="rounded-xl h-12">Batal</Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete} 
            disabled={isLoading}
            className="rounded-xl h-12 font-bold gap-2 shadow-lg shadow-red-200"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
            Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
