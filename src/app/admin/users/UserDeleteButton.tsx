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
import { deleteUser } from "./actions";
import { toast } from "sonner";

export function UserDeleteButton({ userId, userName }: { userId: string; userName?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const res = await deleteUser(userId);
      if (res.success) {
        toast.success("User berhasil dihapus.");
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
          <Button 
            size="icon" 
            variant="ghost" 
            className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
          >
            <Trash2 size={16} />
          </Button>
        }
      />
      <DialogContent className="rounded-[2.5rem] border-none shadow-2xl p-8 max-w-sm">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-100">
            <AlertTriangle size={32} />
          </div>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Hapus Pengguna?</DialogTitle>
            <DialogDescription className="space-y-4 pt-2">
              <p>Apakah Anda yakin ingin menghapus {userName ? <span className="font-bold text-foreground">{userName}</span> : "pengguna ini"}?</p>
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-[11px] text-amber-800 leading-relaxed text-left space-y-2">
                 <p className="font-bold uppercase tracking-widest flex items-center gap-2">
                    <AlertTriangle size={12} /> Resiko Penghapusan:
                 </p>
                 <ul className="list-disc pl-4 space-y-1">
                    <li>Pengguna ini akan segera **kehilangan akses login** ke dashboard.</li>
                    <li>Akun ini tidak akan muncul lagi di daftar staf aktif.</li>
                    <li>**Log Aktivitas** yang pernah dilakukan pengguna ini tetap tersimpan untuk audit.</li>
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
