"use client";

import { useState, useEffect } from "react";
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
  Share2,
  Star,
  Users,
  LayoutGrid,
  GripVertical,
  Eye,
  Settings2,
  CreditCard,
  ShieldCheck,
  Zap,
  ShoppingBag,
  Palette
} from "lucide-react";
import { updateSetting } from "./actions";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Reorder } from "framer-motion";
import { Switch } from "@/components/ui/switch";

export function SettingsForm({ initialData, pages }: { initialData: any, pages: any[] }) {
  const [isLoading, setIsLoading] = useState(false);
  const getVal = (key: string) => initialData.find((s: any) => s.key === key)?.value || "";

  // Dynamic Menu States
  const parseLinks = (key: string, fallback: any[]) => {
    const val = getVal(key);
    if (!val) return fallback;
    try {
      return JSON.parse(val);
    } catch (e) {
      return fallback;
    }
  };

  const [links, setLinks] = useState(parseLinks("nav_links", [
    { name: "Marketplace", href: "/marketplace", type: "custom" },
    { name: "Komunitas", href: "#community", type: "section" },
    { name: "Tentang", href: "#about", type: "section" },
  ]));

  const [linksSolutions, setLinksSolutions] = useState(parseLinks("footer_links_solutions", [
    { name: "Aplikasi Kasir Pro", href: "/marketplace?cat=Kasir", type: "custom" },
    { name: "Laundry Management", href: "/marketplace?cat=Laundry", type: "custom" },
  ]));

  const [linksResources, setLinksResources] = useState(parseLinks("footer_links_resources", [
    { name: "Pusat Bantuan", href: "#", type: "custom" },
    { name: "Blog & Tutorial", href: "/blog", type: "custom" },
  ]));

  const [linksCompany, setLinksCompany] = useState(parseLinks("footer_links_company", [
    { name: "Tentang PlazaKasir", href: "#about", type: "section" },
    { name: "Karir & Budaya", href: "#", type: "custom" },
  ]));

  // Section Reordering State
  const defaultSections = [
    { id: "hero", name: "Hero Section", icon: HomeIcon, description: "Area promosi utama di bagian atas." },
    { id: "categories", name: "Kategori Bisnis", icon: LayoutGrid, description: "Daftar kategori industri UMKM." },
    { id: "featured", name: "Software Unggulan", icon: Star, description: "Produk-produk paling populer." },
    { id: "about", name: "Tentang Kami", icon: FileText, description: "Informasi profil PlazaKasir." },
    { id: "community", name: "Komunitas", icon: Users, description: "Section ajakan bergabung komunitas." },
  ];

  const initialOrder = parseLinks("home_sections_order", ["hero", "categories", "featured", "about", "community"]);
  const [sectionsOrder, setSectionsOrder] = useState(initialOrder);

  // Midtrans State
  const [midtransProduction, setMidtransProduction] = useState(getVal("midtrans_is_production") === "true");

  const updateMenu = (setter: any, current: any[], index: number, field: string, value: string) => {
    const newList = [...current];
    newList[index][field] = value;
    if (field === "type") {
      if (value === "marketplace") newList[index].href = "/marketplace";
      else if (value === "custom") newList[index].href = "";
    }
    setter(newList);
  };

  const addMenuItem = (setter: any, current: any[]) => setter([...current, { name: "", href: "", type: "custom" }]);
  const removeMenuItem = (setter: any, current: any[], index: number) => setter(current.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("nav_links", JSON.stringify(links));
    formData.append("footer_links_solutions", JSON.stringify(linksSolutions));
    formData.append("footer_links_resources", JSON.stringify(linksResources));
    formData.append("footer_links_company", JSON.stringify(linksCompany));
    formData.append("home_sections_order", JSON.stringify(sectionsOrder));
    formData.append("midtrans_is_production", String(midtransProduction));

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

  const MenuList = ({ items, setter, title, icon: Icon }: any) => (
    <Card className="rounded-xl border shadow-sm mb-8">
      <CardHeader className="p-8">
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-primary">
               <Icon size={20} />
               <CardTitle>{title}</CardTitle>
            </div>
            <Button type="button" onClick={() => addMenuItem(setter, items)} variant="outline" size="sm" className="rounded-xl gap-2 font-bold">
               <Plus size={14} /> Tambah
            </Button>
         </div>
      </CardHeader>
      <CardContent className="p-8 pt-0 space-y-4">
         {items.map((link: any, index: number) => (
            <div key={index} className="flex flex-col md:flex-row items-end gap-3 p-4 bg-secondary/10 rounded-2xl border border-border/50">
               <div className="grid grid-cols-1 md:grid-cols-3 flex-1 gap-3 w-full">
                  <div className="space-y-1">
                     <Label className="text-[10px] uppercase font-bold text-muted-foreground">Label</Label>
                     <Input value={link.name} onChange={(e) => updateMenu(setter, items, index, "name", e.target.value)} className="h-9 rounded-lg text-sm" />
                  </div>
                  <div className="space-y-1">
                     <Label className="text-[10px] uppercase font-bold text-muted-foreground">Tipe</Label>
                     <Select value={link.type} onValueChange={(val) => updateMenu(setter, items, index, "type", val)}>
                        <SelectTrigger className="h-9 rounded-lg text-sm"><SelectValue /></SelectTrigger>
                        <SelectContent className="rounded-xl">
                           <SelectItem value="marketplace">Marketplace</SelectItem>
                           <SelectItem value="section">Section Beranda</SelectItem>
                           <SelectItem value="page">Halaman Statis</SelectItem>
                           <SelectItem value="custom">Custom URL</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
                  <div className="space-y-1">
                     <Label className="text-[10px] uppercase font-bold text-muted-foreground">Target</Label>
                     {link.type === "page" ? (
                        <Select value={link.href} onValueChange={(val) => updateMenu(setter, items, index, "href", val)}>
                           <SelectTrigger className="h-9 rounded-lg text-sm"><SelectValue /></SelectTrigger>
                           <SelectContent className="rounded-xl">
                              {pages.map((p: any) => <SelectItem key={p.id} value={`/p/${p.slug}`}>{p.title}</SelectItem>)}
                           </SelectContent>
                        </Select>
                     ) : link.type === "section" ? (
                        <Select value={link.href} onValueChange={(val) => updateMenu(setter, items, index, "href", val)}>
                           <SelectTrigger className="h-9 rounded-lg text-sm"><SelectValue /></SelectTrigger>
                           <SelectContent className="rounded-xl">
                              {homeSections.map((s: any) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                           </SelectContent>
                        </Select>
                     ) : <Input value={link.href} onChange={(e) => updateMenu(setter, items, index, "href", e.target.value)} className="h-9 rounded-lg text-sm" />}
                  </div>
               </div>
               <Button type="button" variant="ghost" size="icon" onClick={() => removeMenuItem(setter, items, index)} className="text-red-500 rounded-lg h-9 w-9"><Trash2 size={16} /></Button>
            </div>
         ))}
      </CardContent>
    </Card>
  );

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-background border border-border p-1 h-14 rounded-2xl mb-8 flex-wrap">
           <TabsTrigger value="general" className="rounded-xl px-6 h-10 data-[state=active]:bg-primary data-[state=active]:text-white">
              <Globe className="mr-2" size={16} /> Identitas
           </TabsTrigger>
           <TabsTrigger value="nav" className="rounded-xl px-6 h-10 data-[state=active]:bg-primary data-[state=active]:text-white">
              <LinkIcon className="mr-2" size={16} /> Navigasi
           </TabsTrigger>
           <TabsTrigger value="home-layout" className="rounded-xl px-6 h-10 data-[state=active]:bg-primary data-[state=active]:text-white">
              <Layout className="mr-2" size={16} /> Tata Letak Home
           </TabsTrigger>
           <TabsTrigger value="content" className="rounded-xl px-6 h-10 data-[state=active]:bg-primary data-[state=active]:text-white">
              <Palette className="mr-2" size={16} /> Konten Halaman
           </TabsTrigger>
           <TabsTrigger value="payment" className="rounded-xl px-6 h-10 data-[state=active]:bg-primary data-[state=active]:text-white">
              <CreditCard className="mr-2" size={16} /> Pembayaran
           </TabsTrigger>
           <TabsTrigger value="footer-links" className="rounded-xl px-6 h-10 data-[state=active]:bg-primary data-[state=active]:text-white">
              <LayoutGrid className="mr-2" size={16} /> Footer Links
           </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-8">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="rounded-xl border shadow-sm">
                <CardHeader className="p-8 pb-4">
                  <div className="flex items-center gap-3 text-primary mb-2">
                     <Globe size={20} />
                     <CardTitle>Identitas Dasar</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-8 pt-4 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="site_title">Judul Website</Label>
                    <Input id="site_title" name="site_title" defaultValue={getVal("site_title") || "PlazaKasir"} className="h-12 rounded-xl border" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seo_description">SEO Meta Description</Label>
                    <Textarea name="seo_description" defaultValue={getVal("seo_description")} className="rounded-xl border min-h-[80px]" />
                  </div>
                  <div className="space-y-4">
                    <Label>Logo Website</Label>
                    <div className="flex items-center gap-6 p-4 border rounded-2xl">
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

              <Card className="rounded-xl border shadow-sm">
                <CardHeader className="p-8 pb-4">
                  <div className="flex items-center gap-3 text-primary mb-2">
                     <MapPin size={20} />
                     <CardTitle>Informasi Kontak</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-8 pt-4 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="contact_email">Email Support</Label>
                    <Input id="contact_email" name="contact_email" defaultValue={getVal("contact_email")} className="h-12 rounded-xl border" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_phone">Nomor WhatsApp</Label>
                    <Input id="contact_phone" name="contact_phone" defaultValue={getVal("contact_phone")} className="h-12 rounded-xl border" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_address">Alamat</Label>
                    <Textarea id="contact_address" name="contact_address" defaultValue={getVal("contact_address")} className="rounded-xl border min-h-[100px]" />
                  </div>
                </CardContent>
              </Card>
           </div>
        </TabsContent>

        <TabsContent value="nav" className="space-y-8">
           <MenuList items={links} setter={setLinks} title="Menu Navigasi Utama" icon={LinkIcon} />
        </TabsContent>

        <TabsContent value="home-layout" className="space-y-8">
           <Card className="rounded-xl border shadow-sm">
              <CardHeader className="p-8">
                 <div className="flex items-center gap-3 text-primary mb-2">
                    <Layout size={20} />
                    <CardTitle>Tata Letak Beranda (Drag & Drop)</CardTitle>
                 </div>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                 <Reorder.Group axis="y" values={sectionsOrder} onReorder={setSectionsOrder} className="space-y-4">
                    {sectionsOrder.map((sectionId: string) => {
                       const section = defaultSections.find(s => s.id === sectionId);
                       if (!section) return null;
                       const Icon = section.icon;
                       return (
                          <Reorder.Item 
                            key={sectionId} 
                            value={sectionId}
                            className="bg-secondary/10 p-5 rounded-2xl border border-border flex items-center justify-between cursor-grab active:cursor-grabbing hover:bg-secondary/20 transition-colors"
                          >
                             <div className="flex items-center gap-5">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                   <Icon size={20} />
                                </div>
                                <div>
                                   <h4 className="font-bold text-sm">{section.name}</h4>
                                   <p className="text-xs text-muted-foreground">{section.description}</p>
                                </div>
                             </div>
                             <GripVertical className="text-muted-foreground" size={20} />
                          </Reorder.Item>
                       );
                    })}
                 </Reorder.Group>
              </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-8">
           <Tabs defaultValue="home-content">
              <TabsList className="bg-muted p-1 rounded-xl mb-6">
                 <TabsTrigger value="home-content" className="rounded-lg">Halaman Beranda</TabsTrigger>
                 <TabsTrigger value="market-content" className="rounded-lg">Marketplace</TabsTrigger>
                 <TabsTrigger value="other-content" className="rounded-lg">Lainnya (Custom)</TabsTrigger>
              </TabsList>
              
              <TabsContent value="home-content" className="space-y-8">
                 <Card className="rounded-xl border shadow-sm">
                    <CardHeader className="p-8 pb-4">
                       <div className="flex items-center gap-3 text-primary mb-2">
                          <HomeIcon size={20} />
                          <CardTitle>Hero Section (Bagian Atas)</CardTitle>
                       </div>
                       <CardDescription>Sesuaikan teks, tombol, dan gambar utama di bagian paling atas beranda.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 pt-4 space-y-8">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                             <div className="space-y-1">
                                <Label className="text-xs uppercase font-bold text-muted-foreground">Badge Kecil (Paling Atas)</Label>
                                <Input name="home_hero_badge" defaultValue={getVal("home_hero_badge") || "Pusat Aplikasi Bisnis UMKM"} className="h-10 rounded-lg" />
                             </div>
                             <div className="space-y-1">
                                <Label className="text-xs uppercase font-bold text-muted-foreground">Judul Utama (Hitam)</Label>
                                <Input name="home_hero_title" defaultValue={getVal("home_hero_title") || "Solusi Digital Terbaik untuk UMKM Indonesia"} className="h-10 rounded-lg" />
                             </div>
                             <div className="space-y-1">
                                <Label className="text-xs uppercase font-bold text-muted-foreground">Judul Highlight (Biru/Italic)</Label>
                                <Input name="home_hero_highlight" defaultValue={getVal("home_hero_highlight") || "Tanpa Ribet."} className="h-10 rounded-lg" />
                             </div>
                             <div className="space-y-1">
                                <Label className="text-xs uppercase font-bold text-muted-foreground">Deskripsi / Sub-judul</Label>
                                <Textarea name="home_hero_subtitle" defaultValue={getVal("home_hero_subtitle")} className="rounded-lg min-h-[100px]" />
                             </div>
                          </div>
                          <div className="space-y-4">
                             <div className="p-4 bg-secondary/5 rounded-2xl border border-dashed space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                   <div className="space-y-1">
                                      <Label className="text-[10px] font-bold">Tombol Utama</Label>
                                      <Input name="home_hero_button" defaultValue={getVal("home_hero_button") || "Mulai Sekarang"} className="h-9 rounded-lg text-xs" />
                                   </div>
                                   <div className="space-y-1">
                                      <Label className="text-[10px] font-bold">Link Utama</Label>
                                      <Input name="home_hero_link" defaultValue={getVal("home_hero_link") || "/marketplace"} className="h-9 rounded-lg text-xs" />
                                   </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                   <div className="space-y-1">
                                      <Label className="text-[10px] font-bold">Tombol Kedua</Label>
                                      <Input name="home_hero_sec_button" defaultValue={getVal("home_hero_sec_button") || "Lihat Demo"} className="h-9 rounded-lg text-xs" />
                                   </div>
                                   <div className="space-y-1">
                                      <Label className="text-[10px] font-bold">Link Kedua</Label>
                                      <Input name="home_hero_sec_link" defaultValue={getVal("home_hero_sec_link") || "#"} className="h-9 rounded-lg text-xs" />
                                   </div>
                                </div>
                             </div>
                             <div className="space-y-2">
                                <Label className="text-xs uppercase font-bold text-muted-foreground">URL Gambar / Mockup Hero</Label>
                                <Input name="home_hero_image" defaultValue={getVal("home_hero_image")} placeholder="Kosongkan untuk menggunakan ilustrasi default" className="h-10 rounded-lg" />
                                <p className="text-[10px] text-muted-foreground italic">Gunakan link gambar (JPG/PNG) untuk mengganti visual kartu di bawah tombol.</p>
                             </div>
                          </div>
                       </div>
                    </CardContent>
                 </Card>

                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Card className="rounded-xl border shadow-sm">
                       <CardHeader className="p-6 pb-2"><CardTitle className="text-lg flex items-center gap-2"><Star size={18} /> Produk Unggulan</CardTitle></CardHeader>
                       <CardContent className="p-6 space-y-4">
                          <div className="space-y-1"><Label className="text-xs">Judul Section</Label><Input name="home_featured_title" defaultValue={getVal("home_featured_title")} className="h-10 rounded-lg" /></div>
                          <div className="space-y-1"><Label className="text-xs">Deskripsi</Label><Textarea name="home_featured_subtitle" defaultValue={getVal("home_featured_subtitle")} className="rounded-lg min-h-[60px]" /></div>
                       </CardContent>
                    </Card>
                    <Card className="rounded-xl border shadow-sm">
                       <CardHeader className="p-6 pb-2"><CardTitle className="text-lg flex items-center gap-2"><FileText size={18} /> Tentang Kami</CardTitle></CardHeader>
                       <CardContent className="p-6 space-y-4">
                          <div className="space-y-1"><Label className="text-xs">Judul</Label><Input name="home_about_title" defaultValue={getVal("home_about_title")} className="h-10 rounded-lg" /></div>
                          <div className="space-y-1"><Label className="text-xs">Konten</Label><Textarea name="home_about_content" defaultValue={getVal("home_about_content")} className="rounded-lg min-h-[100px]" /></div>
                       </CardContent>
                    </Card>
                    <Card className="rounded-xl border shadow-sm">
                       <CardHeader className="p-6 pb-2"><CardTitle className="text-lg flex items-center gap-2"><Users size={18} /> Komunitas</CardTitle></CardHeader>
                       <CardContent className="p-6 space-y-4">
                          <div className="space-y-1"><Label className="text-xs">Judul</Label><Input name="home_community_title" defaultValue={getVal("home_community_title")} className="h-10 rounded-lg" /></div>
                          <div className="space-y-1"><Label className="text-xs">Deskripsi</Label><Textarea name="home_community_subtitle" defaultValue={getVal("home_community_subtitle")} className="rounded-lg min-h-[60px]" /></div>
                       </CardContent>
                    </Card>
                 </div>
              </TabsContent>

              <TabsContent value="market-content" className="space-y-8">
                 <Card className="rounded-xl border shadow-sm">
                    <CardHeader className="p-8">
                       <div className="flex items-center gap-3 text-primary mb-2"><ShoppingBag size={24} /><CardTitle>Konten Marketplace</CardTitle></div>
                       <CardDescription>Kelola teks judul dan deskripsi pada halaman daftar aplikasi.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 space-y-6">
                       <div className="space-y-2"><Label>Judul Utama Marketplace</Label><Input name="market_title" defaultValue={getVal("market_title") || "Marketplace Aplikasi"} className="h-12 rounded-xl border" /></div>
                       <div className="space-y-2"><Label>Deskripsi Marketplace</Label><Textarea name="market_subtitle" defaultValue={getVal("market_subtitle") || "Temukan berbagai aplikasi bisnis untuk mendigitalisasi operasional usaha Anda."} className="rounded-xl border min-h-[100px]" /></div>
                    </CardContent>
                 </Card>
              </TabsContent>

              <TabsContent value="other-content" className="space-y-8">
                 <Card className="rounded-xl border shadow-sm">
                    <CardHeader className="p-8">
                       <div className="flex items-center gap-3 text-primary mb-2"><Layout size={24} /><CardTitle>Header & Footer Layout</CardTitle></div>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 space-y-8">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                             <div className="space-y-2"><Label>Promo Top Bar</Label><Input name="header_promo_text" defaultValue={getVal("header_promo_text")} className="h-12 rounded-xl border" /></div>
                             <div className="space-y-2"><Label>Nav CTA Text</Label><Input name="header_cta_text" defaultValue={getVal("header_cta_text") || "Download Gratis"} className="h-12 rounded-xl border" /></div>
                          </div>
                          <div className="space-y-4">
                             <div className="space-y-2"><Label>Copyright Footer</Label><Input name="site_footer" defaultValue={getVal("site_footer")} className="h-12 rounded-xl border" /></div>
                             <div className="space-y-2"><Label>Footer Description</Label><Textarea name="footer_description" defaultValue={getVal("footer_description")} className="rounded-xl border min-h-[100px]" /></div>
                          </div>
                       </div>
                    </CardContent>
                 </Card>
              </TabsContent>
           </Tabs>
        </TabsContent>

        <TabsContent value="payment" className="space-y-8">
           <Card className="rounded-xl border shadow-sm overflow-hidden">
              <div className="bg-primary/5 p-8 border-b">
                 <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3 text-primary">
                       <CreditCard size={24} />
                       <CardTitle className="text-2xl">Integrasi Midtrans</CardTitle>
                    </div>
                    <div className="flex items-center gap-2 bg-background px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider">
                       {midtransProduction ? <ShieldCheck className="text-green-500" size={14} /> : <Zap className="text-amber-500" size={14} />}
                       {midtransProduction ? "Production Mode" : "Sandbox Mode"}
                    </div>
                 </div>
                 <p className="text-sm text-muted-foreground">Hubungkan PlazaKasir dengan gateway pembayaran nomor #1 di Indonesia.</p>
              </div>
              <CardContent className="p-8 space-y-8">
                 <div className="flex items-center justify-between p-6 bg-secondary/10 rounded-2xl border">
                    <div>
                       <h4 className="font-bold text-sm">Mode Produksi</h4>
                       <p className="text-xs text-muted-foreground">Aktifkan untuk menerima pembayaran asli dari pelanggan.</p>
                    </div>
                    <Switch 
                      checked={midtransProduction} 
                      onCheckedChange={setMidtransProduction}
                    />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <div className="space-y-2">
                          <Label>Client Key</Label>
                          <Input name="midtrans_client_key" defaultValue={getVal("midtrans_client_key")} className="h-12 rounded-xl border font-mono text-xs" />
                       </div>
                       <div className="space-y-2">
                          <Label>Server Key</Label>
                          <Input name="midtrans_server_key" type="password" defaultValue={getVal("midtrans_server_key")} className="h-12 rounded-xl border font-mono text-xs" />
                       </div>
                    </div>
                    <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 flex flex-col justify-between">
                       <div className="space-y-3">
                          <h5 className="text-sm font-bold flex items-center gap-2"><Settings2 size={16} /> Instruksi Webhook</h5>
                          <p className="text-xs text-muted-foreground leading-relaxed">Pastikan Notification URL di dashboard Midtrans disetel ke endpoint webhook sistem.</p>
                          <code className="block p-3 bg-background border rounded-lg text-[10px] font-mono break-all text-primary">
                             {typeof window !== 'undefined' ? `${window.location.origin}/api/payments/webhook` : '.../api/payments/webhook'}
                          </code>
                       </div>
                       <a href="https://dashboard.midtrans.com" target="_blank" rel="noopener noreferrer" className="text-xs text-primary font-bold hover:underline mt-4 inline-block">Buka Dashboard Midtrans →</a>
                    </div>
                 </div>
              </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="footer-links" className="space-y-8">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <MenuList items={linksSolutions} setter={setLinksSolutions} title="Solusi Bisnis" icon={LayoutGrid} />
              <MenuList items={linksResources} setter={setLinksResources} title="Sumber Daya" icon={FileText} />
              <MenuList items={linksCompany} setter={setLinksCompany} title="Perusahaan" icon={Users} />
           </div>
        </TabsContent>
      </Tabs>

      <div className="mt-8 flex justify-end">
        <Button type="submit" disabled={isLoading} className="rounded-xl h-14 px-10 flex gap-3 font-bold shadow-lg shadow-primary/20">
           {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
           {isLoading ? "Menyimpan..." : "Simpan Seluruh Perubahan"}
        </Button>
      </div>
    </form>
  );
}
