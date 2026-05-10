"use client";

import { useTransition, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Trash } from "lucide-react";
import { deleteProduct } from "@/app/admin/products/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function DeleteProductButton({ id, productName }: { id: string; productName: string }) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteProduct(id);
        setIsOpen(false);
      } catch (err) {
        alert("Gagal menghapus produk.");
      }
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger 
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50"
        )}
      >
        <Trash size={16} />
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-[2.5rem] border-none shadow-2xl p-8">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold text-red-600">Hapus Produk?</AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            Apakah Anda yakin ingin menghapus <span className="font-bold text-foreground">"{productName}"</span>? 
            Tindakan ini tidak dapat dibatalkan dan semua data terkait akan dihapus secara permanen.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6 gap-3">
          <AlertDialogCancel className="rounded-xl h-12 px-6 font-bold border-2">Batalkan</AlertDialogCancel>
          <Button 
            onClick={handleDelete}
            disabled={isPending}
            className="rounded-xl h-12 px-6 font-bold bg-red-600 hover:bg-red-700 text-white"
          >
            {isPending ? "Menghapus..." : "Ya, Hapus Produk"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
