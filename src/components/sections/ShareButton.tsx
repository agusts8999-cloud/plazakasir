"use client";

import { Share2, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ShareButton({ title, text }: { title: string; text: string }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        setIsCopied(true);
        toast.success("Link berhasil disalin ke clipboard!");
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
        toast.error("Gagal menyalin link.");
      }
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleShare}
      className="w-full rounded-xl h-12 font-bold flex gap-2 border border-border hover:bg-muted/5 transition-all"
    >
      {isCopied ? <Check size={18} className="text-green-600" /> : <Share2 size={18} />}
      {isCopied ? "Berhasil Disalin" : "Bagikan Ke Teman"}
    </Button>
  );
}
