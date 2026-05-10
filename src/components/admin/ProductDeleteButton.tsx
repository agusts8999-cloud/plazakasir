"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { deleteProduct } from "@/app/admin/products/actions";
import { toast } from "sonner";

export function ProductDeleteButton({ productId }: { productId: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Hapus produk ini secara permanen?")) return;
    
    setIsLoading(true);
    try {
      const res = await deleteProduct(productId);
      if (res.success) {
        toast.success("Produk berhasil dihapus!");
      } else {
        toast.error(res.error || "Gagal menghapus produk");
      }
    } catch (err) {
      toast.error("Kesalahan sistem saat menghapus");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      size="icon" 
      variant="ghost" 
      onClick={handleDelete}
      disabled={isLoading}
      className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
    >
      {isLoading ? <Loader2 className="animate-spin" size={14} /> : <Trash2 size={14} />}
    </Button>
  );
}
