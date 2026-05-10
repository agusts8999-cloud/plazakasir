"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Save, Loader2, MessageSquare, Key, Globe } from "lucide-react";
import { updateIntegrationSettings } from "./actions";
import { toast } from "sonner";

export function WhatsAppForm({ initialData }: { initialData: any }) {
  const [isLoading, setIsLoading] = useState(false);
  const getVal = (key: string) => initialData.find((s: any) => s.key === key)?.value || "";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const result = await updateIntegrationSettings(formData);
      if (result.success) {
        toast.success("Konfigurasi WhatsApp berhasil disimpan!");
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
              <MessageSquare size={24} />
              <CardTitle>WhatsApp Gateway API</CardTitle>
           </div>
           <CardDescription>Integrasikan WhatsApp untuk mengirim notifikasi pembelian secara otomatis.</CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-0 space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <Label htmlFor="wa_api_key">API Key (Token)</Label>
                 <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input id="wa_api_key" name="wa_api_key" type="password" defaultValue={getVal("wa_api_key")} placeholder="••••••••" className="h-12 pl-12 rounded-xl border-2" />
                 </div>
              </div>
              <div className="space-y-2">
                 <Label htmlFor="wa_base_url">Gateway Base URL</Label>
                 <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input id="wa_base_url" name="wa_base_url" defaultValue={getVal("wa_base_url")} placeholder="https://api.fonnte.com/send" className="h-12 pl-12 rounded-xl border-2" />
                 </div>
              </div>
           </div>
           <div className="flex justify-end">
              <Button type="submit" disabled={isLoading} className="rounded-2xl h-14 px-10 font-bold gap-3 shadow-lg shadow-primary/20">
                 {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                 {isLoading ? "Menyimpan..." : "Simpan Konfigurasi WA"}
              </Button>
           </div>
        </CardContent>
      </Card>
    </form>
  );
}
