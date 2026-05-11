"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Save, Loader2, Mail, ShieldCheck, User, Server } from "lucide-react";
import { updateIntegrationSettings } from "./actions";
import { toast } from "sonner";
import { PasswordInput } from "@/components/ui/password-input";

export function SMTPForm({ initialData }: { initialData: any }) {
  const [isLoading, setIsLoading] = useState(false);
  const getVal = (key: string) => initialData.find((s: any) => s.key === key)?.value || "";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const result = await updateIntegrationSettings(formData);
      if (result.success) {
        toast.success("Konfigurasi SMTP berhasil disimpan!");
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
              <Mail size={24} />
              <CardTitle>SMTP Email Server</CardTitle>
           </div>
           <CardDescription>Konfigurasi mail server untuk pengiriman otomatis Product Key dan invoice.</CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-0 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Koneksi */}
              <div className="space-y-6">
                 <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest text-muted-foreground">
                    <Server size={14} /> Server Connection
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="smtp_host">SMTP Host</Label>
                    <Input id="smtp_host" name="smtp_host" defaultValue={getVal("smtp_host")} placeholder="smtp.gmail.com" className="h-12 rounded-xl border-2" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <Label htmlFor="smtp_port">Port</Label>
                       <Input id="smtp_port" name="smtp_port" defaultValue={getVal("smtp_port")} placeholder="465" className="h-12 rounded-xl border-2" />
                    </div>
                    <div className="space-y-2">
                       <Label>Encryption</Label>
                       <Select name="smtp_encryption" defaultValue={getVal("smtp_encryption") || "SSL"}>
                          <SelectTrigger className="h-12 rounded-xl border-2">
                             <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                             <SelectItem value="SSL">SSL (Recommended)</SelectItem>
                             <SelectItem value="TLS">TLS / STARTTLS</SelectItem>
                             <SelectItem value="NONE">None</SelectItem>
                          </SelectContent>
                       </Select>
                    </div>
                 </div>
              </div>

              {/* Autentikasi */}
              <div className="space-y-6">
                 <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest text-muted-foreground">
                    <ShieldCheck size={14} /> Authentication
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="smtp_user">Username / Email</Label>
                    <div className="relative">
                       <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                       <Input id="smtp_user" name="smtp_user" defaultValue={getVal("smtp_user")} placeholder="your-email@gmail.com" className="h-12 pl-12 rounded-xl border-2" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="smtp_pass">App Password</Label>
                    <PasswordInput 
                      id="smtp_pass" 
                      name="smtp_pass" 
                      defaultValue={getVal("smtp_pass")} 
                      placeholder="••••••••••••••••" 
                      className="h-12" 
                    />
                 </div>
              </div>
           </div>

           <div className="border-t pt-8">
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest text-muted-foreground mb-6">
                 <Mail size={14} /> Sender Information
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <Label htmlFor="smtp_from_name">Nama Pengirim</Label>
                    <Input id="smtp_from_name" name="smtp_from_name" defaultValue={getVal("smtp_from_name")} placeholder="PlazaKasir Official" className="h-12 rounded-xl border-2" />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="smtp_from_email">Email Pengirim (From)</Label>
                    <Input id="smtp_from_email" name="smtp_from_email" defaultValue={getVal("smtp_from_email")} placeholder="noreply@plazakasir.com" className="h-12 rounded-xl border-2" />
                 </div>
              </div>
           </div>

           <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isLoading} className="rounded-2xl h-14 px-10 font-bold gap-3 shadow-lg shadow-primary/20">
                 {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                 {isLoading ? "Menyimpan..." : "Simpan Konfigurasi SMTP"}
              </Button>
           </div>
        </CardContent>
      </Card>
    </form>
  );
}
