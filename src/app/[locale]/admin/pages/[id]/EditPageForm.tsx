"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Save, ArrowLeft, ExternalLink, Globe, Loader2 } from "lucide-react";
import Link from "next/link";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { updatePageAction } from "./actions";
import { toast } from "sonner";

export function EditPageForm({ page }: { page: any }) {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState(page.content);
  const [title, setTitle] = useState(page.title);
  const [slug, setSlug] = useState(page.slug);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await updatePageAction(page.id, { title, slug, content });
      if (result.success) {
        toast.success("Halaman berhasil diperbarui!");
      } else {
        toast.error("Gagal memperbarui halaman.");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan sistem.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/pages">
             <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft size={20} />
             </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Edit Halaman</h1>
            <p className="text-muted-foreground">Mengedit konten untuk <span className="font-bold text-foreground">"{page.title}"</span></p>
          </div>
        </div>
        
        <Link href={`/p/${page.slug}`} target="_blank">
           <Button variant="outline" className="rounded-xl gap-2 font-bold border-2">
              <Globe size={16} /> Lihat Halaman Publik <ExternalLink size={14} />
           </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Editor Konten */}
           <div className="lg:col-span-2 space-y-8">
              <Card className="rounded-[2.5rem] border-none shadow-xl">
                <CardHeader className="p-8">
                  <CardTitle>Konten Utama</CardTitle>
                  <CardDescription>Gunakan editor di bawah untuk memformat teks halaman Anda.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Judul Halaman</Label>
                    <Input 
                      id="title" 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                      className="h-12 rounded-xl border-2" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Isi Halaman</Label>
                    <RichTextEditor value={content} onChange={setContent} />
                  </div>
                </CardContent>
              </Card>
           </div>

           {/* Sidebar Pengaturan URL */}
           <div className="space-y-8">
              <Card className="rounded-[2.5rem] border-none shadow-xl bg-primary text-primary-foreground">
                 <CardHeader className="p-8 pb-4">
                    <CardTitle className="text-xl">Info URL & SEO</CardTitle>
                 </CardHeader>
                 <CardContent className="p-8 pt-0 space-y-6">
                    <div className="space-y-2">
                       <Label htmlFor="slug" className="text-primary-foreground/80">Slug / Akhiran URL</Label>
                       <Input 
                        id="slug" 
                        value={slug} 
                        onChange={(e) => setSlug(e.target.value)} 
                        className="bg-white/10 border-white/20 text-white h-11 rounded-xl"
                        required 
                       />
                    </div>
                    <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                       <p className="text-[10px] uppercase font-bold opacity-60 mb-2">Live Preview URL:</p>
                       <p className="text-sm font-mono break-all opacity-90">
                          /p/<span className="font-bold underline">{slug}</span>
                       </p>
                    </div>
                    <p className="text-xs opacity-70 italic leading-relaxed">
                       Peringatan: Jika Anda mengubah slug, link lama mungkin tidak akan berfungsi lagi.
                    </p>
                 </CardContent>
              </Card>

              <div className="flex flex-col gap-3">
                 <Button type="submit" disabled={isLoading} className="w-full rounded-2xl h-14 font-bold gap-3 shadow-xl shadow-primary/20">
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
                 </Button>
                 <Link href="/admin/pages" className="w-full">
                    <Button type="button" variant="ghost" className="w-full rounded-2xl h-12">
                       Batalkan
                    </Button>
                 </Link>
              </div>
           </div>
        </div>
      </form>
    </div>
  );
}
