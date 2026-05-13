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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { UserPlus, Save, Loader2, Edit } from "lucide-react";
import { createUser, updateUser } from "./actions";
import { toast } from "sonner";
import { PasswordInput } from "@/components/ui/password-input";

export function UserDialog({ roles, user, mode = "add" }: { roles: any[]; user?: any; mode?: "add" | "edit" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(user?.roleId || "");
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return toast.error("Password dan Konfirmasi Password tidak cocok!");
    }

    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = mode === "add" 
        ? await createUser(data) 
        : await updateUser(user.id, data);

      if (res.success) {
        toast.success(mode === "add" ? "User berhasil dibuat!" : "User berhasil diperbarui!");
        setIsOpen(false);
        setPassword("");
        setConfirmPassword("");
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
              <UserPlus size={20} /> Tambah User Baru
            </Button>
          ) : (
            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:bg-primary/10">
              <Edit size={14} />
            </Button>
          )
        }
      />
      <DialogContent className="rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden max-w-md">
        <form onSubmit={handleSubmit}>
          <div className="bg-primary p-8 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {mode === "add" ? "Tambah Pengguna" : "Edit Pengguna"}
              </DialogTitle>
              <DialogDescription className="text-white/70">
                {mode === "add" ? "Daftarkan anggota tim baru." : `Mengubah data untuk ${user?.name}`}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <Label>Nama Lengkap</Label>
              <Input name="name" defaultValue={user?.name} placeholder="John Doe" className="h-12 rounded-xl border-2" required />
            </div>
            <div className="space-y-2">
              <Label>Email (Login)</Label>
              <Input name="email" type="email" defaultValue={user?.email} placeholder="john@example.com" className="h-12 rounded-xl border-2" required />
            </div>
            
            <div className="grid grid-cols-1 gap-4">
               <div className="space-y-2">
                  <Label>Password {mode === "edit" && "(Opsional)"}</Label>
                  <PasswordInput 
                    name="password" 
                    placeholder="********" 
                    className="h-12" 
                    required={mode === "add"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
               </div>
               <div className="space-y-2">
                  <Label>Konfirmasi Password</Label>
                  <PasswordInput 
                    placeholder="********" 
                    className="h-12" 
                    required={mode === "add"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
               </div>
            </div>
            
            <div className="space-y-2">
              <Label>Pilih Peranan (Role)</Label>
              <Select name="roleId" value={selectedRoleId} onValueChange={setSelectedRoleId} required>
                <SelectTrigger className="h-12 rounded-xl border-2 bg-background">
                  <SelectValue placeholder="Pilih Role">
                    {roles.find(r => r.id === selectedRoleId)?.name}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-xl shadow-xl">
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="p-8 pt-0">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="rounded-xl h-12">Batal</Button>
            <Button type="submit" disabled={isLoading || roles.length === 0} className="rounded-xl h-12 px-8 font-bold gap-2">
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {isLoading ? "Menyimpan..." : "Simpan Data"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
