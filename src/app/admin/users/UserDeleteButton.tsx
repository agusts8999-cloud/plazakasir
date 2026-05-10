"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { deleteUser } from "./actions";
import { toast } from "sonner";

export function UserDeleteButton({ userId }: { userId: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Hapus pengguna ini secara permanen?")) return;
    setIsLoading(true);
    try {
      const res = await deleteUser(userId);
      if (res.success) toast.success("User dihapus.");
      else toast.error(res.error);
    } catch (err) {
      toast.error("Kesalahan sistem.");
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
      className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
    >
      {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
    </Button>
  );
}
