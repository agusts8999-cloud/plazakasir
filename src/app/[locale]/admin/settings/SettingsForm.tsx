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
  Palette,
  Heart,
  DollarSign,
  Languages
} from "lucide-react";
import { updateSetting } from "./actions";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Reorder } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { localeNames } from "@/navigation";

export function SettingsForm({ initialData, pages }: { initialData: any, pages: any[] }) {
  const [isLoading, setIsLoading] = useState(false);
  const [editLocale, setEditLocale] = useState("id");

  const getVal = (key: string, locale?: string) => {
    const targetKey = (locale && locale !== 'id') ? `${locale}_${key}` : key;
    return initialData.find((s: any) => s.key === targetKey)?.value || "";
  };

  // State for dynamic fields that change when locale changes
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  useEffect(() => {
    // Reset form values when locale changes to show localized content
    setFormValues({});
  }, [editLocale]);

  // Helper to get value considering editLocale
  const getDisplayVal = (key: string) => {
    if (formValues[key] !== undefined) return formValues[key];
    return getVal(key, editLocale);
  };

  // Dynamic Menu States
  const parseLinks = (key: string, locale: string, fallback: any[]) => {
    const val = getVal(key, locale);
    if (!val) return fallback;
    try {
      return JSON.parse(val);
    } catch (e) {
      return fallback;
    }
  };

  const [links, setLinks] = useState<any[]>([]);
  const [linksSolutions, setLinksSolutions] = useState<any[]>([]);
  const [linksResources, setLinksResources] = useState<any[]>([]);
  const [linksCompany, setLinksCompany] = useState<any[]>([]);

  useEffect(() => {
    setLinks(parseLinks("nav_links", editLocale, [
      { name: "Marketplace", href: "/marketplace", type: "custom" },
      { name: "Komunitas", href: "#community", type: "section" },
      { name: "Tentang", href: "#about", type: "section" },
    ]));
    setLinksSolutions(parseLinks("footer_links_solutions", editLocale, []));
    setLinksResources(parseLinks("footer_links_resources", editLocale, []));
    setLinksCompany(parseLinks("footer_links_company", editLocale, []));
  }, [editLocale]);

  // Section Reordering State
  const defaultSections = [
    { id: "hero", name: "Hero Section", icon: HomeIcon, description: "Area promosi utama di bagian atas." },
    { id: "categories", name: "Kategori Bisnis", icon: LayoutGrid, description: "Daftar kategori industri UMKM." },
    { id: "featured", name: "Software Unggulan", icon: Star, description: "Produk-produk paling populer." },
    { id: "about", name: "Tentang Kami", icon: FileText, description: "Informasi profil PlazaKasir." },
    { id: "community", name: "Komunitas", icon: Users, description: "Section ajakan bergabung komunitas." },
    { id: "donation", name: "Donasi", icon: Heart, description: "Dukungan pengembangan platform." },
  ];

  const [sectionsOrder, setSectionsOrder] = useState(parseLinks("home_sections_order", "id", ["hero", "categories", "featured", "about", "community", "donation"]));

  // Midtrans & PayPal States
  const [midtransProduction, setMidtransProduction] = useState(getVal("midtrans_is_production") === "true");
  const [paypalProduction, setPaypalProduction] = useState(getVal("paypal_mode") === "live");

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
    formData.append("_locale", editLocale);
    formData.append("nav_links", JSON.stringify(links));
    formData.append("footer_links_solutions", JSON.stringify(linksSolutions));
    formData.append("footer_links_resources", JSON.stringify(linksResources));
    formData.append("footer_links_company", JSON.stringify(linksCompany));
    formData.append("home_sections_order", JSON.stringify(sectionsOrder));
    formData.append("midtrans_is_production", String(midtransProduction));
    formData.append("paypal_mode", paypalProduction ? "live" : "sandbox");

    try {
      const result = await updateSetting(formData);
      if (result.success) {
        toast.success(`Konfigurasi (${editLocale.toUpperCase()}) berhasil disimpan!`);
        // Refresh page to get new initialData
        window.location.reload();
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
    { label: "Donasi", value: "#donation" },
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
      <div className="sticky top-20 z-40 bg-background/80 backdrop-blur-md border rounded-2xl p-4 mb-8 flex items-center justify-between shadow-sm">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
               <Languages size={20} />
            </div>
            <div>
               <h3 className="font-bold text-sm">Mode Edit Bahasa</h3>
               <p className="text-xs text-muted-foreground">Mengedit konten untuk: <span className="font-bold text-primary">{(localeNames as any)[editLocale]}</span></p>
            </div>
         </div>
         <div className="flex gap-2">
            {(Object.keys(localeNames) as Array<keyof typeof localeNames>).map((loc) => (
               <Button 
                  key={loc} 
                  type="button" 
                  variant={editLocale === loc ? "default" : "outline"}
                  size="sm"
                  onClick={() => setEditLocale(loc)}
                  className="rounded-lg font-bold text-xs"
               >
                  {loc.toUpperCase()}
               </Button>
            ))}
         </div>
      </div>

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
           <TabsTrigger value="donation" className="rounded-xl px-6 h-10 data-[state=active]:bg-primary data-[state=active]:text-white">
              <Heart className="mr-2" size={16} /> Donasi
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
                    <Input id="site_title" name="site_title" value={getDisplayVal("site_title")} onChange={(e) => setFormValues({...formValues, site_title: e.target.value})} className="h-12 rounded-xl border" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seo_description">SEO Meta Description</Label>
                    <Textarea name="seo_description" value={getDisplayVal("seo_description")} onChange={(e) => setFormValues({...formValues, seo_description: e.target.value})} className="rounded-xl border min-h-[80px]" />
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
                    <Input id="contact_email" name="contact_email" value={getDisplayVal("contact_email")} onChange={(e) => setFormValues({...formValues, contact_email: e.target.value})} className="h-12 rounded-xl border" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_phone">Nomor WhatsApp</Label>
                    <Input id="contact_phone" name="contact_phone" value={getDisplayVal("contact_phone")} onChange={(e) => setFormValues({...formValues, contact_phone: e.target.value})} className="h-12 rounded-xl border" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_address">Alamat</Label>
                    <Textarea id="contact_address" name="contact_address" value={getDisplayVal("contact_address")} onChange={(e) => setFormValues({...formValues, contact_address: e.target.value})} className="rounded-xl border min-h-[100px]" />
                  </div>
                </CardContent>
              </Card>
           </div>
        </TabsContent>

        <TabsContent value="nav" className="space-y-8">
           <MenuList items={links} setter={setLinks} title={`Menu Navigasi (${editLocale.toUpperCase()})`} icon={LinkIcon} />
        </TabsContent>

        <TabsContent value="home-layout" className="space-y-8">
           <Card className="rounded-xl border shadow-sm">
              <CardHeader className="p-8">
                 <div className="flex items-center gap-3 text-primary mb-2">
                    <Layout size={20} />
                    <CardTitle>Tata Letak Beranda (Global)</CardTitle>
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
                          <CardTitle>Hero Section ({editLocale.toUpperCase()})</CardTitle>
                       </div>
                    </CardHeader>
                    <CardContent className="p-8 pt-4 space-y-8">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                             <div className="space-y-1">
                                <Label className="text-xs uppercase font-bold text-muted-foreground">Badge Kecil</Label>
                                <Input name="home_hero_badge" value={getDisplayVal("home_hero_badge")} onChange={(e) => setFormValues({...formValues, home_hero_badge: e.target.value})} className="h-10 rounded-lg" />
                             </div>
                             <div className="space-y-1">
                                <Label className="text-xs uppercase font-bold text-muted-foreground">Judul Utama</Label>
                                <Input name="home_hero_title" value={getDisplayVal("home_hero_title")} onChange={(e) => setFormValues({...formValues, home_hero_title: e.target.value})} className="h-10 rounded-lg" />
                             </div>
                             <div className="space-y-1">
                                <Label className="text-xs uppercase font-bold text-muted-foreground">Judul Highlight</Label>
                                <Input name="home_hero_highlight" value={getDisplayVal("home_hero_highlight")} onChange={(e) => setFormValues({...formValues, home_hero_highlight: e.target.value})} className="h-10 rounded-lg" />
                             </div>
                             <div className="space-y-1">
                                <Label className="text-xs uppercase font-bold text-muted-foreground">Deskripsi</Label>
                                <Textarea name="home_hero_subtitle" value={getDisplayVal("home_hero_subtitle")} onChange={(e) => setFormValues({...formValues, home_hero_subtitle: e.target.value})} className="rounded-lg min-h-[100px]" />
                             </div>
                          </div>
                          <div className="space-y-4">
                             <div className="p-4 bg-secondary/5 rounded-2xl border border-dashed space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                   <div className="space-y-1">
                                      <Label className="text-[10px] font-bold">Tombol Utama</Label>
                                      <Input name="home_hero_button" value={getDisplayVal("home_hero_button")} onChange={(e) => setFormValues({...formValues, home_hero_button: e.target.value})} className="h-9 rounded-lg text-xs" />
                                   </div>
                                   <div className="space-y-1">
                                      <Label className="text-[10px] font-bold">Link Utama</Label>
                                      <Input name="home_hero_link" value={getDisplayVal("home_hero_link")} onChange={(e) => setFormValues({...formValues, home_hero_link: e.target.value})} className="h-9 rounded-lg text-xs" />
                                   </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                   <div className="space-y-1">
                                      <Label className="text-[10px] font-bold">Tombol Kedua</Label>
                                      <Input name="home_hero_sec_button" value={getDisplayVal("home_hero_sec_button")} onChange={(e) => setFormValues({...formValues, home_hero_sec_button: e.target.value})} className="h-9 rounded-lg text-xs" />
                                   </div>
                                   <div className="space-y-1">
                                      <Label className="text-[10px] font-bold">Link Kedua</Label>
                                      <Input name="home_hero_sec_link" value={getDisplayVal("home_hero_sec_link")} onChange={(e) => setFormValues({...formValues, home_hero_sec_link: e.target.value})} className="h-9 rounded-lg text-xs" />
                                   </div>
                                </div>
                             </div>
                             <div className="space-y-2">
                                <Label className="text-xs uppercase font-bold text-muted-foreground">URL Gambar Hero</Label>
                                <Input name="home_hero_image" value={getDisplayVal("home_hero_image")} onChange={(e) => setFormValues({...formValues, home_hero_image: e.target.value})} className="h-10 rounded-lg" />
                             </div>
                          </div>
                       </div>
                    </CardContent>
                 </Card>

                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Card className="rounded-xl border shadow-sm">
                       <CardHeader className="p-6 pb-2"><CardTitle className="text-lg flex items-center gap-2"><Star size={18} /> Produk Unggulan</CardTitle></CardHeader>
                       <CardContent className="p-6 space-y-4">
                          <div className="space-y-1"><Label className="text-xs">Judul Section</Label><Input name="home_featured_title" value={getDisplayVal("home_featured_title")} onChange={(e) => setFormValues({...formValues, home_featured_title: e.target.value})} className="h-10 rounded-lg" /></div>
                          <div className="space-y-1"><Label className="text-xs">Deskripsi</Label><Textarea name="home_featured_subtitle" value={getDisplayVal("home_featured_subtitle")} onChange={(e) => setFormValues({...formValues, home_featured_subtitle: e.target.value})} className="rounded-lg min-h-[60px]" /></div>
                       </CardContent>
                    </Card>
                    <Card className="rounded-xl border shadow-sm">
                       <CardHeader className="p-6 pb-2"><CardTitle className="text-lg flex items-center gap-2"><FileText size={18} /> Tentang Kami</CardTitle></CardHeader>
                       <CardContent className="p-6 space-y-4">
                          <div className="space-y-1"><Label className="text-xs">Judul</Label><Input name="home_about_title" value={getDisplayVal("home_about_title")} onChange={(e) => setFormValues({...formValues, home_about_title: e.target.value})} className="h-10 rounded-lg" /></div>
                          <div className="space-y-1"><Label className="text-xs">Konten</Label><Textarea name="home_about_content" value={getDisplayVal("home_about_content")} onChange={(e) => setFormValues({...formValues, home_about_content: e.target.value})} className="rounded-lg min-h-[100px]" /></div>
                       </CardContent>
                    </Card>
                    <Card className="rounded-xl border shadow-sm">
                       <CardHeader className="p-6 pb-2"><CardTitle className="text-lg flex items-center gap-2"><Users size={18} /> Komunitas</CardTitle></CardHeader>
                       <CardContent className="p-6 space-y-4">
                          <div className="space-y-1"><Label className="text-xs">Judul</Label><Input name="home_community_title" value={getDisplayVal("home_community_title")} onChange={(e) => setFormValues({...formValues, home_community_title: e.target.value})} className="h-10 rounded-lg" /></div>
                          <div className="space-y-1"><Label className="text-xs">Deskripsi</Label><Textarea name="home_community_subtitle" value={getDisplayVal("home_community_subtitle")} onChange={(e) => setFormValues({...formValues, home_community_subtitle: e.target.value})} className="rounded-lg min-h-[60px]" /></div>
                       </CardContent>
                    </Card>
                 </div>
              </TabsContent>

              <TabsContent value="market-content" className="space-y-8">
                 <Card className="rounded-xl border shadow-sm">
                    <CardHeader className="p-8">
                       <div className="flex items-center gap-3 text-primary mb-2"><ShoppingBag size={24} /><CardTitle>Konten Marketplace ({editLocale.toUpperCase()})</CardTitle></div>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 space-y-6">
                       <div className="space-y-2"><Label>Judul Utama</Label><Input name="market_title" value={getDisplayVal("market_title")} onChange={(e) => setFormValues({...formValues, market_title: e.target.value})} className="h-12 rounded-xl border" /></div>
                       <div className="space-y-2"><Label>Deskripsi</Label><Textarea name="market_subtitle" value={getDisplayVal("market_subtitle")} onChange={(e) => setFormValues({...formValues, market_subtitle: e.target.value})} className="rounded-xl border min-h-[100px]" /></div>
                    </CardContent>
                 </Card>
              </TabsContent>

              <TabsContent value="other-content" className="space-y-8">
                 <Card className="rounded-xl border shadow-sm">
                    <CardHeader className="p-8">
                       <div className="flex items-center gap-3 text-primary mb-2"><Layout size={24} /><CardTitle>Header & Footer Layout ({editLocale.toUpperCase()})</CardTitle></div>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 space-y-8">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                             <div className="space-y-2"><Label>Promo Top Bar</Label><Input name="header_promo_text" value={getDisplayVal("header_promo_text")} onChange={(e) => setFormValues({...formValues, header_promo_text: e.target.value})} className="h-12 rounded-xl border" /></div>
                             <div className="space-y-2"><Label>Nav CTA Text</Label><Input name="header_cta_text" value={getDisplayVal("header_cta_text")} onChange={(e) => setFormValues({...formValues, header_cta_text: e.target.value})} className="h-12 rounded-xl border" /></div>
                          </div>
                          <div className="space-y-4">
                             <div className="space-y-2"><Label>Copyright Footer</Label><Input name="site_footer" value={getDisplayVal("site_footer")} onChange={(e) => setFormValues({...formValues, site_footer: e.target.value})} className="h-12 rounded-xl border" /></div>
                             <div className="space-y-2"><Label>Footer Description</Label><Textarea name="footer_description" value={getDisplayVal("footer_description")} onChange={(e) => setFormValues({...formValues, footer_description: e.target.value})} className="rounded-xl border min-h-[100px]" /></div>
                          </div>
                       </div>
                    </CardContent>
                 </Card>
              </TabsContent>
           </Tabs>
        </TabsContent>

        <TabsContent value="donation" className="space-y-8">
           <Card className="rounded-xl border shadow-sm">
              <CardHeader className="p-8">
                 <div className="flex items-center gap-3 text-pink-500 mb-2">
                    <Heart size={24} fill="currentColor" />
                    <CardTitle className="text-2xl">Dukungan Pengembangan</CardTitle>
                 </div>
                 <CardDescription>Kelola konten untuk ajakan donasi guna pengembangan platform PlazaKasir.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <div className="space-y-2">
                          <Label>Judul Donasi</Label>
                          <Input name="donation_title" value={getDisplayVal("donation_title") || "Dukung Digitalisasi UMKM Indonesia"} onChange={(e) => setFormValues({...formValues, donation_title: e.target.value})} className="h-12 rounded-xl border" />
                       </div>
                       <div className="space-y-2">
                          <Label>Deskripsi Ajakan</Label>
                          <Textarea name="donation_subtitle" value={getDisplayVal("donation_subtitle")} onChange={(e) => setFormValues({...formValues, donation_subtitle: e.target.value})} className="rounded-xl border min-h-[120px]" />
                       </div>
                    </div>
                    <div className="space-y-4">
                       <div className="p-6 bg-pink-50/50 rounded-2xl border border-pink-100 space-y-4">
                          <div className="space-y-1">
                             <Label className="text-xs font-bold text-pink-600">Target Donasi (Rp)</Label>
                             <Input name="donation_target" type="number" defaultValue={getVal("donation_target") || "10000000"} className="h-10 rounded-lg" />
                          </div>
                          <div className="space-y-1">
                             <Label className="text-xs font-bold text-pink-600">Teks Tombol Donasi</Label>
                             <Input name="donation_button" value={getDisplayVal("donation_button") || "Donasi Sekarang"} onChange={(e) => setFormValues({...formValues, donation_button: e.target.value})} className="h-10 rounded-lg" />
                          </div>
                       </div>
                       <div className="space-y-1">
                          <Label className="text-xs uppercase font-bold text-muted-foreground">URL Gambar Donasi (Opsional)</Label>
                          <Input name="donation_image" value={getDisplayVal("donation_image")} onChange={(e) => setFormValues({...formValues, donation_image: e.target.value})} className="h-10 rounded-lg" />
                       </div>
                    </div>
                 </div>
              </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-8">
           <div className="grid grid-cols-1 gap-8">
              {/* Midtrans */}
              <Card className="rounded-xl border shadow-sm overflow-hidden">
                 <div className="bg-primary/5 p-8 border-b">
                    <div className="flex items-center justify-between mb-2">
                       <div className="flex items-center gap-3 text-primary">
                          <CreditCard size={24} />
                          <CardTitle className="text-2xl">Midtrans Integration</CardTitle>
                       </div>
                       <div className="flex items-center gap-2 bg-background px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider">
                          {midtransProduction ? <ShieldCheck className="text-green-500" size={14} /> : <Zap className="text-amber-500" size={14} />}
                          {midtransProduction ? "Production" : "Sandbox"}
                       </div>
                    </div>
                 </div>
                 <CardContent className="p-8 space-y-6">
                    <div className="flex items-center justify-between p-6 bg-secondary/10 rounded-2xl border">
                       <div><h4 className="font-bold text-sm">Mode Produksi</h4><p className="text-xs text-muted-foreground">Aktifkan untuk menerima pembayaran asli.</p></div>
                       <Switch checked={midtransProduction} onCheckedChange={setMidtransProduction} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-4">
                          <div className="space-y-1"><Label>Client Key</Label><Input name="midtrans_client_key" defaultValue={getVal("midtrans_client_key")} className="h-10 rounded-lg font-mono text-xs" /></div>
                          <div className="space-y-1"><Label>Server Key</Label><Input name="midtrans_server_key" type="password" defaultValue={getVal("midtrans_server_key")} className="h-10 rounded-lg font-mono text-xs" /></div>
                       </div>
                    </div>
                 </CardContent>
              </Card>

              {/* PayPal */}
              <Card className="rounded-xl border shadow-sm overflow-hidden">
                 <div className="bg-[#0070ba]/5 p-8 border-b">
                    <div className="flex items-center justify-between mb-2">
                       <div className="flex items-center gap-3 text-[#0070ba]">
                          <DollarSign size={24} />
                          <CardTitle className="text-2xl">PayPal International</CardTitle>
                       </div>
                       <div className="flex items-center gap-2 bg-background px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider">
                          {paypalProduction ? <ShieldCheck className="text-green-500" size={14} /> : <Zap className="text-amber-500" size={14} />}
                          {paypalProduction ? "Live" : "Sandbox"}
                       </div>
                    </div>
                    <p className="text-sm text-muted-foreground">Aktifkan pembayaran internasional menggunakan PayPal.</p>
                 </div>
                 <CardContent className="p-8 space-y-6">
                    <div className="flex items-center justify-between p-6 bg-secondary/10 rounded-2xl border">
                       <div><h4 className="font-bold text-sm">Mode Live</h4><p className="text-xs text-muted-foreground">Gunakan akun PayPal Live untuk transaksi nyata.</p></div>
                       <Switch checked={paypalProduction} onCheckedChange={setPaypalProduction} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-4">
                          <div className="space-y-1"><Label>PayPal Client ID</Label><Input name="paypal_client_id" defaultValue={getVal("paypal_client_id")} className="h-10 rounded-lg font-mono text-xs" /></div>
                          <div className="space-y-1"><Label>PayPal Secret Key</Label><Input name="paypal_secret" type="password" defaultValue={getVal("paypal_secret")} className="h-10 rounded-lg font-mono text-xs" /></div>
                       </div>
                       <div className="p-6 bg-[#0070ba]/5 rounded-2xl border border-[#0070ba]/10 space-y-3">
                          <h5 className="text-sm font-bold">Informasi PayPal</h5>
                          <p className="text-xs text-muted-foreground leading-relaxed">PayPal akan otomatis mengonversi tagihan ke USD menggunakan kurs yang Anda tentukan atau kurs pasar saat ini.</p>
                          <div className="space-y-2">
                             <Label className="text-[10px] font-bold">Kurs IDR ke 1 USD</Label>
                             <Input name="currency_rate_usd" type="number" defaultValue={getVal("currency_rate_usd") || "16000"} className="h-9 rounded-lg" />
                          </div>
                       </div>
                    </div>
                 </CardContent>
              </Card>
           </div>
        </TabsContent>

        <TabsContent value="footer-links" className="space-y-8">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <MenuList items={linksSolutions} setter={setLinksSolutions} title={`Solusi (${editLocale.toUpperCase()})`} icon={LayoutGrid} />
              <MenuList items={linksResources} setter={setLinksResources} title={`Sumber Daya (${editLocale.toUpperCase()})`} icon={FileText} />
              <MenuList items={linksCompany} setter={setLinksCompany} title={`Perusahaan (${editLocale.toUpperCase()})`} icon={Users} />
           </div>
        </TabsContent>
      </Tabs>

      <div className="mt-8 flex justify-end">
        <Button type="submit" disabled={isLoading} className="rounded-xl h-14 px-10 flex gap-3 font-bold shadow-lg shadow-primary/20">
           {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
           {isLoading ? "Menyimpan..." : `Simpan Perubahan (${editLocale.toUpperCase()})`}
        </Button>
      </div>
    </form>
  );
}
