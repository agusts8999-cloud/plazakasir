import { db } from "@/lib/db";
import { products as productSchema, categories as categorySchema } from "@/db/schema";
import { eq, and, ilike, desc, isNull } from "drizzle-orm";
import { Input } from "@/components/ui/input";
import { Search, Monitor } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { getSetting } from "@/lib/settings";

export default async function MarketplacePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ cat?: string; q?: string }>;
}) {
  const { locale } = await params;
  const { cat, q } = await searchParams;

  // Fetch actual categories from DB
  const dbCategories = await db.select().from(categorySchema);
  const categoriesList = ["Semua", ...dbCategories.map(c => c.name)];

  const whereConditions = [];
  whereConditions.push(eq(productSchema.isActive, true));
  whereConditions.push(isNull(productSchema.deletedAt));
  
  if (cat && cat !== "Semua") {
    whereConditions.push(eq(categorySchema.name, cat));
  }
  
  if (q) {
    whereConditions.push(ilike(productSchema.name, `%${q}%`));
  }

  const products = await db
    .select({
      id: productSchema.id,
      name: productSchema.name,
      price: productSchema.price,
      promoPrice: productSchema.promoPrice,
      type: productSchema.type,
      image: productSchema.image,
      categoryName: categorySchema.name,
    })
    .from(productSchema)
    .leftJoin(categorySchema, eq(productSchema.categoryId, categorySchema.id))
    .where(and(...whereConditions))
    .orderBy(desc(productSchema.createdAt));

  const marketTitle = await getSetting("market_title", "Marketplace Aplikasi");
  const marketSubtitle = await getSetting("market_subtitle", "Temukan berbagai aplikasi bisnis untuk mendigitalisasi operasional usaha Anda.");

  return (
    <div className="pt-32 pb-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
          <div className="max-w-xl">
            <h1 className="text-4xl font-bold mb-4 tracking-tight">{marketTitle}</h1>
            <p className="text-muted-foreground">{marketSubtitle}</p>
          </div>
          
          <form action="/marketplace" method="GET" className="relative w-full md:w-[350px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input 
              name="q"
              defaultValue={q}
              placeholder="Cari aplikasi..." 
              className="pl-12 h-14 rounded-2xl border-2 focus-visible:ring-primary shadow-sm"
            />
            {cat && <input type="hidden" name="cat" value={cat} />}
          </form>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-3 overflow-x-auto pb-6 mb-12 no-scrollbar">
          {categoriesList.map((c) => (
            <Link key={c} href={`/marketplace?cat=${c}${q ? `&q=${q}` : ""}`}>
              <Badge 
                variant={cat === c || (!cat && c === "Semua") ? "default" : "outline"}
                className={`px-6 py-2 rounded-full text-sm font-bold cursor-pointer transition-all ${
                  cat === c || (!cat && c === "Semua") ? "shadow-lg shadow-primary/20" : "hover:bg-primary/5"
                }`}
              >
                {c}
              </Badge>
            </Link>
          ))}
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id} className="group bg-background border border-border rounded-[2rem] p-5 transition-all hover:border-primary/30 hover:shadow-xl">
                <Link href={`/marketplace/${product.id}`}>
                  <div className="relative aspect-square bg-secondary rounded-3xl mb-4 overflow-hidden flex items-center justify-center">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <Monitor className="text-muted-foreground opacity-20" size={40} />
                    )}
                    {product.type === "FREE" && <Badge className="absolute top-3 left-3 bg-green-500 text-white font-bold">FREE</Badge>}
                  </div>
                  <h3 className="font-bold mb-1 line-clamp-1">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">{product.categoryName}</span>
                    <span className="text-sm font-black text-primary">
                       {formatCurrency(product.type === "FREE" ? 0 : (product.promoPrice || product.price || 0))}
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-secondary/20 rounded-[3rem] border border-dashed border-border">
            <p className="text-muted-foreground font-medium">Tidak ada aplikasi ditemukan di kategori ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}
