"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Save, Loader2, Instagram, Music2, Globe } from "lucide-react";
import { updateIntegrationSettings } from "./actions";
import { toast } from "sonner";

export function SocialForm({ initialData }: { initialData: any }) {
  const [isLoading, setIsLoading] = useState(false);
  const getVal = (key: string) => initialData.find((s: any) => s.key === key)?.value || "";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const result = await updateIntegrationSettings(formData);
      if (result.success) {
        toast.success("Link Sosial Media berhasil disimpan!");
      } else {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error("Terjadi kesalahan sistem.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="rounded-[2.5rem] border-none shadow-xl">
        <CardHeader className="p-8">
           <div className="flex items-center gap-3 text-primary mb-2">
              <Globe size={24} />
              <CardTitle>Link Sosial Media</CardTitle>
           </div>
           <CardDescription>Atur link sosial media PlazaKasir untuk fitur Follow-to-Unlock.</CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-0 space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <Label htmlFor="medsos_instagram">Instagram URL</Label>
                 <div className="relative">
                    <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input id="medsos_instagram" name="medsos_instagram" defaultValue={getVal("medsos_instagram")} placeholder="https://instagram.com/plazakasir" className="h-12 pl-12 rounded-xl border-2" />
                 </div>
              </div>
              <div className="space-y-2">
                 <Label htmlFor="medsos_tiktok">TikTok URL</Label>
                 <div className="relative">
                    <Music2 className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input id="medsos_tiktok" name="medsos_tiktok" defaultValue={getVal("medsos_tiktok")} placeholder="https://tiktok.com/@plazakasir" className="h-12 pl-12 rounded-xl border-2" />
                 </div>
              </div>
           </div>
           <div className="flex justify-end">
              <Button type="submit" disabled={isLoading} className="rounded-2xl h-14 px-10 font-bold gap-3 shadow-lg shadow-primary/20">
                 {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                 {isLoading ? "Menyimpan..." : "Simpan Link Medsos"}
              </Button>
           </div>
        </CardContent>
      </Card>
    </form>
  );
}
