import { db } from "@/lib/db";
import { pages as pagesSchema } from "@/db/schema";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, FileText, Globe } from "lucide-react";
import Link from "next/link";

export default async function AdminPages({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const pages = await db.select().from(pagesSchema);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Manajemen Halaman Statis</h1>
        <p className="text-muted-foreground">Kelola konten untuk halaman Tentang, Kebijakan, dan Syarat Ketentuan.</p>
      </div>

      <div className="bg-background border border-border rounded-[2.5rem] overflow-hidden shadow-xl">
        <Table>
          <TableHeader className="bg-secondary/30">
            <TableRow>
              <TableHead className="px-8 h-16 font-bold">Judul Halaman</TableHead>
              <TableHead className="h-16 font-bold">Slug / URL</TableHead>
              <TableHead className="h-16 font-bold">Terakhir Diperbarui</TableHead>
              <TableHead className="h-16 font-bold text-right px-8">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.map((p) => (
              <TableRow key={p.id} className="hover:bg-secondary/10 transition-colors">
                <TableCell className="px-8 py-6">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                         <FileText size={20} />
                      </div>
                      <span className="font-bold">{p.title}</span>
                   </div>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                   /{p.slug}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                   {p.updatedAt?.toLocaleDateString("id-ID")}
                </TableCell>
                <TableCell className="text-right px-8 space-x-2">
                   <div className="flex items-center justify-end gap-2">
                     <Link href={`/admin/pages/${p.id}`}>
                        <Button variant="ghost" size="icon" className="rounded-xl">
                           <Edit size={16} />
                        </Button>
                     </Link>
                     <Link href={`/p/${p.slug}`} target="_blank">
                        <Button variant="outline" size="sm" className="rounded-xl gap-2 font-bold h-9">
                           <Globe size={14} /> Lihat
                        </Button>
                     </Link>
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
