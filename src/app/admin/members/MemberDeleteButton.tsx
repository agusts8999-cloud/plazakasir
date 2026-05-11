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
import { deleteMember } from "./actions";
import { toast } from "sonner";

export function MemberDeleteButton({ memberId, memberName }: { memberId: string; memberName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const res = await deleteMember(memberId);
      if (res.success) {
        toast.success("Anggota berhasil dihapus.");
        setIsOpen(false);
      } else {
        toast.error(res.error);
      }
    } catch (err) {
      toast.error("Terjadi kesalahan sistem.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger 
        render={
          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500">
            <Trash2 size={14} />
          </Button>
        }
      />
      <DialogContent className="rounded-xl border-none shadow-2xl p-8 max-w-md">
        <div className="flex flex-col items-center text-center gap-6">
          <div className="w-14 h-14 bg-red-50 text-red-600 rounded-lg flex items-center justify-center border border-red-100 shadow-inner">
            <AlertTriangle size={28} />
          </div>
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold tracking-tight">Hapus Anggota?</DialogTitle>
            <DialogDescription className="space-y-4 pt-2">
              <p className="text-sm font-medium">Apakah Anda yakin ingin menghapus <span className="text-foreground font-bold">{memberName}</span> dari sistem?</p>
              <div className="bg-amber-50/50 border border-amber-200/50 p-4 rounded-lg text-[11px] text-amber-900 leading-relaxed text-left space-y-2">
                 <p className="font-bold uppercase tracking-widest flex items-center gap-2 text-amber-700">
                    <AlertTriangle size={12} /> Dampak Penghapusan:
                 </p>
                 <ul className="list-disc pl-4 space-y-1 font-medium">
                    <li>Data anggota tidak akan ditampilkan di daftar aktif.</li>
                    <li>Sesi login (jika ada) akan segera dianulir.</li>
                    <li><span className="font-bold underline">Histori transaksi tetap tersimpan</span> dalam basis data keuangan.</li>
                 </ul>
              </div>
            </DialogDescription>
          </DialogHeader>
        </div>
        <DialogFooter className="flex items-center gap-3 mt-8">
          <Button variant="ghost" onClick={() => setIsOpen(false)} className="flex-1 rounded-md h-10 font-bold text-xs">Batal</Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete} 
            disabled={isLoading}
            className="flex-1 rounded-md h-10 font-bold text-xs gap-2 shadow-sm"
          >
            {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
            Konfirmasi Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
