import { db } from "@/lib/db";
import { products, categories, licenses, releaseInfos } from "@/db/schema";
import { desc } from "drizzle-orm";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductDialog } from "@/components/admin/ProductDialog";
import { ProductDeleteButton } from "@/components/admin/ProductDeleteButton";
import { Package, Tag, ShieldCheck, Info, Eye, ExternalLink } from "lucide-react";
import Link from "next/link";

export default async function AdminProductsPage() {
  const allProducts = await db.query.products.findMany({
    orderBy: [desc(products.createdAt)],
    with: {
      category: true,
      license: true,
      releaseInfo: true,
    }
  });

  const cats = await db.select().from(categories);
  const lics = await db.select().from(licenses);
  const infos = await db.select().from(releaseInfos);

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Manajemen Produk</h1>
          <p className="text-muted-foreground">Kelola katalog aplikasi, harga, dan file installer.</p>
        </div>
        <ProductDialog mode="add" categories={cats} licenses={lics} releaseInfos={infos} />
      </div>

      <div className="bg-background border border-border rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/5">
        <Table>
          <TableHeader className="bg-secondary/30">
            <TableRow>
              <TableHead className="px-8 py-6">Produk</TableHead>
              <TableHead>Kategori / Lisensi</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Harga</TableHead>
              <TableHead className="text-right px-8">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allProducts.map((p) => (
              <TableRow key={p.id} className="group hover:bg-secondary/10 transition-colors">
                <TableCell className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 overflow-hidden shrink-0">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="text-primary opacity-50" size={24} />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-foreground leading-tight">{p.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-1">SKU: {p.sku}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <Tag size={12} className="text-primary/60" /> {p.category?.name}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <ShieldCheck size={12} className="text-emerald-500/60" /> {p.license?.name}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {p.status === "COMING_SOON" ? (
                    <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 gap-1.5 px-3">
                      <Info size={12} /> Coming Soon
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 gap-1.5 px-3">
                      <ExternalLink size={12} /> Live
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right font-mono font-bold text-primary">
                  {formatCurrency(p.price)}
                </TableCell>
                <TableCell className="text-right px-8">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/marketplace/${p.id}`} target="_blank">
                      <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:bg-primary/10">
                        <Eye size={14} />
                      </Button>
                    </Link>
                    <ProductDialog 
                      mode="edit" 
                      product={p} 
                      categories={cats} 
                      licenses={lics} 
                      releaseInfos={infos} 
                    />
                    <ProductDeleteButton productId={p.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
