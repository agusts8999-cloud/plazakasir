import { db } from "@/lib/db";
import { products, categories, licenses, releaseInfos } from "@/db/schema";
import { desc, isNull } from "drizzle-orm";
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
import { formatCurrency } from "@/lib/utils";

export default async function AdminProductsPage() {
  const allProducts = await db.query.products.findMany({
    where: isNull(products.deletedAt),
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


  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Manajemen Produk</h1>
          <p className="text-muted-foreground">Kelola katalog aplikasi, harga, dan file installer.</p>
        </div>
        <ProductDialog mode="add" categories={cats} licenses={lics} releaseInfos={infos} />
      </div>

      <div className="bg-background border border-border rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Produk</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider">Kategori / Lisensi</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider">Status</TableHead>
              <TableHead className="text-right text-xs font-bold uppercase tracking-wider">Harga</TableHead>
              <TableHead className="text-right px-6 text-xs font-bold uppercase tracking-wider">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allProducts.map((p) => (
              <TableRow key={p.id} className="group hover:bg-muted/5 transition-colors border-b last:border-0">
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center border border-border overflow-hidden shrink-0 shadow-inner">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="text-muted-foreground/50" size={18} />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground leading-tight">{p.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-1.5 opacity-70">SKU: {p.sku}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground/80">
                      <Tag size={10} className="text-primary/60" /> {p.category?.name || "Uncategorized"}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-600/80">
                      <ShieldCheck size={10} /> {p.license?.name || "No License"}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {p.status === "COMING_SOON" ? (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1.5 px-2.5 py-0 text-[10px] font-bold uppercase tracking-tighter">
                      Coming Soon
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1.5 px-2.5 py-0 text-[10px] font-bold uppercase tracking-tighter">
                      Live / Active
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right font-mono font-black text-sm text-foreground">
                  {formatCurrency(p.price || 0)}
                </TableCell>
                <TableCell className="text-right px-6">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/marketplace/${p.id}`} target="_blank">
                      <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all">
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
                    <ProductDeleteButton productId={p.id} productName={p.name} />
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
