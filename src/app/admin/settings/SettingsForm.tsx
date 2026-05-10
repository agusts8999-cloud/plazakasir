"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Globe, 
  MapPin, 
  Phone, 
  Mail, 
  Image as ImageIcon, 
  Save, 
  Loader2, 
  Home as HomeIcon, 
  Layout, 
  FileText,
  PanelTop,
  Link as LinkIcon,
  Plus,
  Trash2,
  Search,
  Share2
} from "lucide-react";
import { updateSetting } from "./actions";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SettingsForm({ initialData, pages }: { initialData: any, pages: any[] }) {
  const [isLoading, setIsLoading] = useState(false);
  const getVal = (key: string) => initialData.find((s: any) => s.key === key)?.value || "";

  // Dynamic Menu State
  const initialLinks = getVal("nav_links") ? JSON.parse(getVal("nav_links")) : [
    { name: "Marketplace", href: "/marketplace", type: "custom" },
    { name: "Komunitas", href: "#community", type: "section" },
    { name: "Tentang", href: "#about", type: "section" },
  ];
  const [links, setLinks] = useState(initialLinks);

  const addLink = () => setLinks([...links, { name: "", href: "", type: "custom" }]);
  const removeLink = (index: number) => setLinks(links.filter((_: any, i: number) => i !== index));
  const updateLink = (index: number, field: string, value: string) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    if (field === "type") {
      if (value === "marketplace") newLinks[index].href = "/marketplace";
      else if (value === "custom") newLinks[index].href = "";
    }
    setLinks(newLinks);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("nav_links", JSON.stringify(links));

    try {
      const result = await updateSetting(formData);
      if (result.success) {
        toast.success("Konfigurasi berhasil disimpan!");
      } else {
        toast.error(result.error || "Gagal menyimpan perubahan.");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan sistem.");
    } finally {
      setIsLoading(false);
    }
  };

  const homeSections = [
    { label: "Hero (Atas)", value: "#home" },
    { label: "Kategori", value: "#categories" },
    { label: "Produk Unggulan", value: "#featured" },
    { label: "Tentang Kami", value: "#about" },
    { label: "Komunitas", value: "#community" },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-background border border-border p-1 h-14 rounded-2xl mb-8 flex-wrap">
           <TabsTrigger value="general" className="rounded-xl px-6 h-10 data-[state=active]:bg-primary data-[state=active]:text-white">
              <Globe className="mr-2" size={16} /> Identitas
           </TabsTrigger>
           <TabsTrigger value="seo" className="rounded-xl px-6 h-10 data-[state=active]:bg-primary data-[state=active]:text-white">
              <Search className="mr-2" size={16} /> SEO & Meta
           </TabsTrigger>
           <TabsTrigger value="nav" className="rounded-xl px-6 h-10 data-[state=active]:bg-primary data-[state=active]:text-white">
              <LinkIcon className="mr-2" size={16} /> Navigasi
           </TabsTrigger>
           <TabsTrigger value="home" className="rounded-xl px-6 h-10 data-[state=active]:bg-primary data-[state=active]:text-white">
              <HomeIcon className="mr-2" size={16} /> Home
           </TabsTrigger>
           <TabsTrigger value="header-footer" className="rounded-xl px-6 h-10 data-[state=active]:bg-primary data-[state=active]:text-white">
              <PanelTop className="mr-2" size={16} /> Layout
           </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-8">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="rounded-[2.5rem] border-none shadow-xl shadow-primary/5">
                <CardHeader className="p-8 pb-4">
                  <div className="flex items-center gap-3 text-primary mb-2">
                     <Globe size={20} />
                     <CardTitle>Identitas Dasar</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-8 pt-4 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="site_title">Judul Website</Label>
                    <Input id="site_title" name="site_title" defaultValue={getVal("site_title") || "PlazaKasir"} className="h-12 rounded-xl border-2" />
                  </div>
                  <div className="space-y-4">
                    <Label>Logo Website</Label>
                    <div className="flex items-center gap-6 p-4 border-2 border-dashed rounded-2xl">
                       <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center overflow-hidden border">
                          {getVal("site_logo") ? (
                            <img src={getVal("site_logo")} alt="Logo" className="w-full h-full object-contain" />
                          ) : (
                            <ImageIcon className="text-muted-foreground opacity-20" />
                          )}
                       </div>
                       <div className="flex-1 space-y-2">
                          <Input type="file" name="site_logo_file" accept="image/*" className="h-10 text-xs" />
                          <Input type="hidden" name="site_logo" defaultValue={getVal("site_logo")} />
                       </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[2.5rem] border-none shadow-xl shadow-primary/5">
                <CardHeader className="p-8 pb-4">
                  <div className="flex items-center gap-3 text-primary mb-2">
                     <MapPin size={20} />
                     <CardTitle>Informasi Kontak</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-8 pt-4 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="contact_email">Email Support</Label>
                    <Input id="contact_email" name="contact_email" defaultValue={getVal("contact_email")} className="h-12 rounded-xl border-2" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_phone">Nomor WhatsApp</Label>
                    <Input id="contact_phone" name="contact_phone" defaultValue={getVal("contact_phone")} className="h-12 rounded-xl border-2" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_address">Alamat</Label>
                    <Textarea id="contact_address" name="contact_address" defaultValue={getVal("contact_address")} className="rounded-xl border-2 min-h-[100px]" />
                  </div>
                </CardContent>
              </Card>
           </div>
        </TabsContent>

        <TabsContent value="seo" className="space-y-8">
           <Card className="rounded-[2.5rem] border-none shadow-xl shadow-primary/5">
              <CardHeader className="p-8">
                 <div className="flex items-center gap-3 text-primary mb-2">
                    <Search size={20} />
                    <CardTitle>Global SEO & Meta Tags</CardTitle>
                 </div>
                 <CardDescription>Optimalkan visibilitas website Anda di Google dan mesin pencari lainnya.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-6">
                 <div className="space-y-2">
                    <Label>Meta Description</Label>
                    <Textarea 
                      name="seo_description" 
                      defaultValue={getVal("seo_description") || "Pusat aplikasi bisnis murah untuk UMKM Indonesia."} 
                      className="rounded-xl border-2 min-h-[100px]" 
                      placeholder="Deskripsi singkat website Anda (maks 160 karakter)..."
                    />
                 </div>
                 <div className="space-y-2">
                    <Label>Keywords</Label>
                    <Input 
                      name="seo_keywords" 
                      defaultValue={getVal("seo_keywords")} 
                      placeholder="aplikasi kasir, software laundry, umkm digital, dll"
                      className="h-12 rounded-xl border-2" 
                    />
                 </div>
                 <div className="space-y-2 pt-4">
                    <div className="flex items-center gap-2 mb-4 text-primary font-bold">
                       <Share2 size={18} /> Open Graph (Social Sharing)
                    </div>
                    <div className="space-y-2">
                       <Label>OG Image URL</Label>
                       <Input 
                        name="seo_og_image" 
                        defaultValue={getVal("seo_og_image")} 
                        placeholder="URL gambar untuk dibagikan ke medsos"
                        className="h-12 rounded-xl border-2" 
                       />
                    </div>
                 </div>
              </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="nav" className="space-y-8">
           <Card className="rounded-[2.5rem] border-none shadow-xl shadow-primary/5">
              <CardHeader className="p-8">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-primary">
                       <LinkIcon size={20} />
                       <CardTitle>Menu Navigasi Utama</CardTitle>
                    </div>
                    <Button type="button" onClick={addLink} variant="outline" className="rounded-xl gap-2 font-bold">
                       <Plus size={16} /> Tambah Menu
                    </Button>
                 </div>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-4">
                 {links.map((link: any, index: number) => (
                    <div key={index} className="flex flex-col md:flex-row items-end gap-4 p-6 bg-secondary/20 rounded-3xl border border-border">
                       <div className="grid grid-cols-1 md:grid-cols-3 flex-1 gap-4 w-full">
                          <div className="space-y-2">
                             <Label className="text-[10px] uppercase font-bold text-muted-foreground">Label Menu</Label>
                             <Input value={link.name} onChange={(e) => updateLink(index, "name", e.target.value)} className="h-11 rounded-xl border-2" />
                          </div>
                          <div className="space-y-2">
                             <Label className="text-[10px] uppercase font-bold text-muted-foreground">Tipe Link</Label>
                             <Select value={link.type} onValueChange={(val) => updateLink(index, "type", val)}>
                                <SelectTrigger className="h-11 rounded-xl border-2"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-xl">
                                   <SelectItem value="marketplace">Marketplace</SelectItem>
                                   <SelectItem value="page">Halaman Statis</SelectItem>
                                   <SelectItem value="section">Section Home</SelectItem>
                                   <SelectItem value="custom">Custom URL</SelectItem>
                                </SelectContent>
                             </Select>
                          </div>
                          <div className="space-y-2">
                             <Label className="text-[10px] uppercase font-bold text-muted-foreground">Target</Label>
                             {link.type === "page" ? (
                                <Select value={link.href} onValueChange={(val) => updateLink(index, "href", val)}>
                                   <SelectTrigger className="h-11 rounded-xl border-2"><SelectValue /></SelectTrigger>
                                   <SelectContent className="rounded-xl">
                                      {pages.map(p => <SelectItem key={p.id} value={`/p/${p.slug}`}>{p.title}</SelectItem>)}
                                   </SelectContent>
                                </Select>
                             ) : link.type === "section" ? (
                                <Select value={link.href} onValueChange={(val) => updateLink(index, "href", val)}>
                                   <SelectTrigger className="h-11 rounded-xl border-2"><SelectValue /></SelectTrigger>
                                   <SelectContent className="rounded-xl">
                                      {homeSections.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                                   </SelectContent>
                                </Select>
                             ) : <Input value={link.href} onChange={(e) => updateLink(index, "href", e.target.value)} className="h-11 rounded-xl border-2" />}
                          </div>
                       </div>
                       <Button type="button" variant="ghost" size="icon" onClick={() => removeLink(index)} className="text-red-500 rounded-xl mb-[2px]"><Trash2 size={18} /></Button>
                    </div>
                 ))}
              </CardContent>
           </Card>
        </TabsContent>

        {/* ... Rest of the tabs (Home, Header-Footer) remain ... */}
        <TabsContent value="home" className="space-y-8">
           <Card className="rounded-[2.5rem] border-none shadow-xl shadow-primary/5">
              <CardHeader className="p-8">
                 <div className="flex items-center gap-3 text-primary mb-2"><Layout size={20} /><CardTitle>Hero Section</CardTitle></div>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-6">
                 <div className="space-y-2"><Label>Judul Utama</Label><Input name="home_hero_title" defaultValue={getVal("home_hero_title")} className="h-12 rounded-xl border-2" /></div>
                 <div className="space-y-2"><Label>Sub-judul</Label><Textarea name="home_hero_subtitle" defaultValue={getVal("home_hero_subtitle")} className="rounded-xl border-2 min-h-[80px]" /></div>
              </CardContent>
           </Card>
        </TabsContent>
        <TabsContent value="header-footer" className="space-y-8">
           <Card className="rounded-[2.5rem] border-none shadow-xl shadow-primary/5">
              <CardHeader className="p-8"><div className="flex items-center gap-3 text-primary mb-2"><PanelTop size={20} /><CardTitle>Layout</CardTitle></div></CardHeader>
              <CardContent className="p-8 pt-0 space-y-6">
                 <div className="space-y-2"><Label>Promo Text</Label><Input name="header_promo_text" defaultValue={getVal("header_promo_text")} className="h-12 rounded-xl border-2" /></div>
                 <div className="space-y-2"><Label>Footer Copyright</Label><Input name="site_footer" defaultValue={getVal("site_footer")} className="h-12 rounded-xl border-2" /></div>
              </CardContent>
           </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 flex justify-end">
        <Button type="submit" disabled={isLoading} className="rounded-2xl h-14 px-10 flex gap-3 font-bold shadow-lg shadow-primary/20">
           {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
           {isLoading ? "Menyimpan..." : "Simpan Seluruh Perubahan"}
        </Button>
      </div>
    </form>
  );
}
