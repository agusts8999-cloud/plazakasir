import { db } from "@/lib/db";
import { 
  products as productSchema, 
  categories as categorySchema, 
  licenses as licenseSchema,
  productFeatures,
  productRequirements,
  releaseInfos
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  Monitor, 
  Share2, 
  ShieldCheck, 
  PlayCircle,
  Clock,
  Layout,
  Tag,
  FileCode,
  AlertCircle,
  Calendar,
  Rocket
} from "lucide-react";
import Image from "next/image";
import { DownloadFlow } from "@/components/sections/DownloadFlow";
import Link from "next/link";

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  
  const results = await db
    .select()
    .from(productSchema)
    .where(eq(productSchema.id, id))
    .limit(1);
    
  const product = results[0];

  if (!product) return notFound();

  // Fetch relations
  const category = product.categoryId ? (await db.select().from(categorySchema).where(eq(categorySchema.id, product.categoryId)).limit(1))[0] : null;
  const license = product.licenseId ? (await db.select().from(licenseSchema).where(eq(licenseSchema.id, product.licenseId)).limit(1))[0] : null;
  const features = await db.select().from(productFeatures).where(eq(productFeatures.productId, product.id));
  const requirements = (await db.select().from(productRequirements).where(eq(productRequirements.productId, product.id)).limit(1))[0];
  const releaseInfo = product.releaseInfoId ? (await db.select().from(releaseInfos).where(eq(releaseInfos.id, product.releaseInfoId)).limit(1))[0] : null;

  const isComingSoon = product.status === "COMING_SOON";

  return (
    <div className="pt-32 pb-20">
      <div className="container mx-auto px-6">
        {/* Breadcrumb / Nav */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
           <Link href="/marketplace">Marketplace</Link>
           <span>/</span>
           <span className="text-foreground font-medium">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <div className="flex items-center gap-3 mb-4">
               <Badge className="bg-primary/10 text-primary border-none font-bold px-4 py-1">{category?.name || "General"}</Badge>
               {isComingSoon && <Badge className="bg-orange-500 text-white font-bold px-4 py-1 flex gap-2"><Rocket size={14} /> COMING SOON</Badge>}
               <span className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-1 rounded">SKU: {product.sku}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{product.name}</h1>
            
            <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-muted-foreground">
               <div className="flex items-center gap-2">
                  <FileCode size={16} className="text-primary" /> Versi {product.version}
               </div>
               <div className="flex items-center gap-2">
                  <Clock size={16} className="text-primary" /> Rilis: {product.releaseDate?.toLocaleDateString("id-ID")}
               </div>
               <div className="flex items-center gap-2">
                  <AlertCircle size={16} className={product.supportStatus === 'ACTIVE' ? "text-green-500" : "text-orange-500"} /> 
                  Support {product.supportStatus}
               </div>
            </div>

            {/* Main Visual */}
            <div className="relative aspect-video bg-secondary rounded-[2.5rem] overflow-hidden mb-12 border border-border group">
               {product.image ? (
                  <Image src={product.image} alt={product.name} fill className="object-cover" />
               ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                    <Monitor size={64} className="opacity-20" />
                  </div>
               )}
               
               {product.youtubeUrl && (
                  <Link href={product.youtubeUrl} target="_blank" className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle size={64} className="text-white drop-shadow-lg" />
                    <span className="mt-4 font-bold text-xs uppercase tracking-widest text-white">Tonton Video Demo</span>
                  </Link>
               )}
            </div>

            {isComingSoon && releaseInfo ? (
               <div className="bg-orange-50 border border-orange-100 rounded-[2.5rem] p-10 mb-12">
                  <h2 className="text-2xl font-bold text-orange-950 mb-4 flex items-center gap-3">
                     <Rocket className="text-orange-600" /> {releaseInfo.title}
                  </h2>
                  <div className="text-orange-900/80 leading-relaxed mb-8 whitespace-pre-line">
                     {releaseInfo.content}
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white/50 rounded-2xl border border-orange-200">
                     <Calendar className="text-orange-600" />
                     <div>
                        <p className="text-[10px] uppercase font-bold text-orange-800/50">Estimasi Peluncuran</p>
                        <p className="font-bold text-orange-950">{releaseInfo.estimateDate || "Segera Hadir"}</p>
                     </div>
                  </div>
               </div>
            ) : null}

            {/* Description & Features */}
            <div className="space-y-12">
               <div>
                  <h2 className="text-2xl font-bold mb-6">Tentang Aplikasi</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {product.description || "Aplikasi ini dirancang untuk mempermudah operasional bisnis Anda dengan fitur lengkap dan interface yang ramah pengguna."}
                  </p>
               </div>

               {features.length > 0 && (
                  <div>
                     <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <Layout className="text-primary" /> Fitur Unggulan
                     </h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {features.map((feature) => (
                          <div key={feature.id} className="flex items-center gap-3 p-4 bg-secondary/30 rounded-2xl border border-border/50">
                             <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                                <CheckCircle2 size={18} />
                             </div>
                             <span className="font-bold text-sm">{feature.name}</span>
                          </div>
                        ))}
                     </div>
                  </div>
               )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
             <div className="sticky top-32 p-8 bg-background border border-border rounded-[2.5rem] shadow-2xl shadow-primary/5">
                <div className="mb-8">
                   <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-2">Harga Software</p>
                   {product.type === "FREE" ? (
                     <div className="text-4xl font-black text-green-600">Gratis</div>
                   ) : (
                     <div className="flex items-end gap-3">
                        <span className="text-4xl font-black">
                           Rp {Number(product.promoPrice || product.price).toLocaleString("id-ID")}
                        </span>
                        {product.promoPrice && (
                           <span className="text-lg text-muted-foreground line-through opacity-50 mb-1">
                               Rp {Number(product.price).toLocaleString("id-ID")}
                           </span>
                        )}
                     </div>
                   )}
                </div>

                <div className="space-y-4 mb-8">
                   <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <ShieldCheck size={18} className="text-primary" />
                      <span className="font-bold text-foreground">{license?.name || "Standard License"}</span>
                   </div>
                   <div className="flex items-center gap-3 text-sm text-muted-foreground px-7">
                      <p className="text-xs italic opacity-70">{license?.description || "Lisensi standar PlazaKasir."}</p>
                   </div>
                   <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Tag size={18} className="text-primary" />
                      <span>Kategori: {category?.name || "General"}</span>
                   </div>
                </div>

                {/* Download Flow Client Component (Only show if LAUNCHED) */}
                {!isComingSoon ? (
                  <DownloadFlow productName={product.name} />
                ) : (
                  <div className="p-6 bg-orange-50 border border-orange-200 rounded-3xl text-center">
                     <Rocket className="mx-auto text-orange-600 mb-2" />
                     <p className="font-bold text-orange-950 text-sm">Produk Sedang Disiapkan</p>
                     <p className="text-[10px] text-orange-800/70 mt-1 uppercase font-bold tracking-widest">Cek informasi rilis di sebelah kiri</p>
                  </div>
                )}

                <div className="mt-8 pt-8 border-t border-border flex flex-col gap-4">
                   <Button variant="outline" className="w-full rounded-2xl h-12 font-bold flex gap-2">
                      <Share2 size={18} /> Bagikan Ke Teman
                   </Button>
                   <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-bold">
                      Aman & Terpercaya oleh PlazaKasir
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
