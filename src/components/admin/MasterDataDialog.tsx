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
import { Plus, Edit, Save, Trash2, Loader2 } from "lucide-react";
import { 
  createCategory, updateCategory, deleteCategory,
  createLicense, updateLicense, deleteLicense,
  createReleaseInfo, updateReleaseInfo, deleteReleaseInfo
} from "@/app/admin/master/actions";
import { toast } from "sonner";

interface MasterDataDialogProps {
  type: "category" | "license" | "releaseInfo";
  mode: "add" | "edit";
  data?: any;
}

export function MasterDataDialog({ type, mode, data }: MasterDataDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getTitle = () => {
    const action = mode === "add" ? "Tambah" : "Edit";
    if (type === "category") return `${action} Kategori`;
    if (type === "license") return `${action} Lisensi`;
    return `${action} Info Rilis`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const values: any = Object.fromEntries(formData.entries());

    try {
      if (type === "category") {
        mode === "add" ? await createCategory(values) : await updateCategory(data.id, values);
      } else if (type === "license") {
        mode === "add" ? await createLicense(values) : await updateLicense(data.id, values);
      } else {
        mode === "add" ? await createReleaseInfo(values) : await updateReleaseInfo(data.id, values);
      }
      toast.success("Data berhasil disimpan!");
      setIsOpen(false);
    } catch (err) {
      toast.error("Gagal menyimpan data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Yakin ingin menghapus data ini?")) return;
    setIsLoading(true);
    try {
      if (type === "category") await deleteCategory(data.id);
      else if (type === "license") await deleteLicense(data.id);
      else await deleteReleaseInfo(data.id);
      toast.success("Data berhasil dihapus!");
      setIsOpen(false);
    } catch (err) {
      toast.error("Gagal menghapus data.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger 
        render={
          mode === "add" ? (
            <Button size="sm" variant="outline" className="rounded-xl gap-2 font-bold h-10 border-2">
              <Plus size={16} /> Tambah
            </Button>
          ) : (
            <Button size="icon" variant="ghost" className="rounded-xl h-8 w-8 hover:bg-primary/10 hover:text-primary">
              <Edit size={14} />
            </Button>
          )
        }
      />
      <DialogContent className="rounded-[2rem] border-none shadow-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl font-bold">{getTitle()}</DialogTitle>
            <DialogDescription>Isi detail data master dengan benar.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {type === "category" && (
              <>
                <div className="space-y-2">
                  <Label>Nama Kategori</Label>
                  <Input name="name" defaultValue={data?.name} required className="rounded-xl border-2" />
                </div>
                <div className="space-y-2">
                  <Label>Slug (Tanpa Spasi)</Label>
                  <Input name="slug" defaultValue={data?.slug} required className="rounded-xl border-2" />
                </div>
              </>
            )}

            {type === "license" && (
              <>
                <div className="space-y-2">
                  <Label>Nama Lisensi</Label>
                  <Input name="name" defaultValue={data?.name} required className="rounded-xl border-2" />
                </div>
                <div className="space-y-2">
                  <Label>Deskripsi</Label>
                  <Textarea name="description" defaultValue={data?.description} className="rounded-xl border-2" />
                </div>
              </>
            )}

            {type === "releaseInfo" && (
              <>
                <div className="space-y-2">
                  <Label>Judul Info</Label>
                  <Input name="title" defaultValue={data?.title} required className="rounded-xl border-2" />
                </div>
                <div className="space-y-2">
                  <Label>Isi Informasi</Label>
                  <Textarea name="content" defaultValue={data?.content} required className="rounded-xl border-2 min-h-[100px]" />
                </div>
                <div className="space-y-2">
                  <Label>Estimasi Tanggal/Bulan</Label>
                  <Input name="estimateDate" defaultValue={data?.estimateDate} placeholder="Contoh: Juni 2026" className="rounded-xl border-2" />
                </div>
              </>
            )}
          </div>

          <DialogFooter className="mt-8 gap-2">
            {mode === "edit" && (
              <Button type="button" variant="ghost" onClick={handleDelete} className="rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 mr-auto">
                <Trash2 size={18} className="mr-2" /> Hapus
              </Button>
            )}
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="rounded-xl">Batal</Button>
            <Button type="submit" disabled={isLoading} className="rounded-xl font-bold gap-2 px-6">
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {isLoading ? "Menyimpan..." : "Simpan Data"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
