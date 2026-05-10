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
import { Plus, Edit, Save, ShieldCheck, Loader2 } from "lucide-react";
import { createRole, updateRole } from "./actions";
import { toast } from "sonner";

const AVAILABLE_PERMISSIONS = [
  { id: "dashboard", name: "Dashboard", desc: "Akses ringkasan statistik & aktivitas" },
  { id: "products", name: "Manajemen Produk", desc: "Tambah, Edit, & Hapus Produk" },
  { id: "pages", name: "Halaman Statis", desc: "Kelola About, Privacy, Terms, dll" },
  { id: "settings", name: "Konfigurasi Web", desc: "Kelola Logo, SEO, & Header/Footer" },
  { id: "integrations", name: "Social & API", desc: "Setting WhatsApp & Facebook Pixel" },
  { id: "master", name: "Master Data", desc: "Kelola Kategori, Lisensi & Info Rilis" },
  { id: "users", name: "Manajemen User", desc: "Kelola Pengguna & Hak Akses (Role)" },
];

export function RoleDialog({ mode = "add", role }: { mode?: "add" | "edit", role?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(role?.name || "");
  const [selected, setSelected] = useState<string[]>(
    role?.permissions ? JSON.parse(role.permissions) : []
  );

  const togglePermission = (id: string) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!name) return toast.error("Nama role wajib diisi");
    setIsLoading(true);
    try {
      if (mode === "add") await createRole({ name, permissions: selected });
      else await updateRole(role.id, { name, permissions: selected });
      
      toast.success("Role berhasil disimpan!");
      setIsOpen(false);
    } catch (err) {
      toast.error("Gagal menyimpan role");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger 
        render={
          mode === "add" ? (
            <Button variant="outline" className="rounded-xl gap-2 font-bold h-11 border-2">
              <Plus size={18} /> Tambah Role
            </Button>
          ) : (
            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:bg-primary/10">
              <Edit size={14} />
            </Button>
          )
        }
      />
      <DialogContent className="rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden max-w-2xl">
        <div className="bg-primary p-8 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {mode === "add" ? "Tambah Role Baru" : "Edit Role"}
            </DialogTitle>
            <DialogDescription className="text-white/70">
              Tentukan peranan dan batasi menu apa saja yang bisa diakses.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto thin-scrollbar">
          <div className="space-y-2">
            <Label>Nama Role (Contoh: Editor Konten, Manager Produk)</Label>
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama role..." 
              className="h-12 rounded-xl border-2" 
            />
          </div>

          <div className="space-y-4">
            <Label className="flex items-center gap-2 text-primary font-bold">
              <ShieldCheck size={18} /> Daftar Izin Akses (Permissions)
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {AVAILABLE_PERMISSIONS.map((perm) => (
                <div 
                  key={perm.id}
                  onClick={() => togglePermission(perm.id)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-4 ${
                    selected.includes(perm.id) 
                      ? "border-primary bg-primary/5 shadow-inner" 
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                    selected.includes(perm.id) ? "bg-primary border-primary" : "border-border bg-background"
                  }`}>
                    {selected.includes(perm.id) && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{perm.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-1 leading-tight">{perm.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="p-8 pt-0">
          <Button variant="ghost" onClick={() => setIsOpen(false)} className="rounded-xl h-12">Batal</Button>
          <Button 
            disabled={isLoading} 
            onClick={handleSubmit}
            className="rounded-xl h-12 px-8 font-bold gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {isLoading ? "Menyimpan..." : "Simpan Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
