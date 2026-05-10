import { db } from "@/lib/db";
import { categories, licenses, releaseInfos } from "@/db/schema";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Info, Tag, ShieldCheck } from "lucide-react";
import { MasterDataDialog } from "@/components/admin/MasterDataDialog";

export default async function MasterDataPage() {
  const cats = await db.select().from(categories);
  const lics = await db.select().from(licenses);
  const infos = await db.select().from(releaseInfos);

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Master Data</h1>
          <p className="text-muted-foreground">Kelola kategori produk, jenis lisensi, dan informasi perilisan.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
         {/* Kategori */}
         <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
               <div className="flex items-center gap-3 text-primary font-bold uppercase tracking-widest text-xs">
                  <Tag size={16} /> Kategori Produk
               </div>
               <MasterDataDialog type="category" mode="add" />
            </div>
            <div className="bg-background border border-border rounded-[2.5rem] overflow-hidden shadow-xl">
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead className="px-8">Nama</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead className="text-right px-8 w-20">Aksi</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {cats.map(c => (
                        <TableRow key={c.id}>
                           <TableCell className="px-8 font-bold">{c.name}</TableCell>
                           <TableCell className="text-xs font-mono">{c.slug}</TableCell>
                           <TableCell className="text-right px-8">
                              <MasterDataDialog type="category" mode="edit" data={c} />
                           </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </div>
         </div>

         {/* Lisensi */}
         <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
               <div className="flex items-center gap-3 text-primary font-bold uppercase tracking-widest text-xs">
                  <ShieldCheck size={16} /> Jenis Lisensi
               </div>
               <MasterDataDialog type="license" mode="add" />
            </div>
            <div className="bg-background border border-border rounded-[2.5rem] overflow-hidden shadow-xl">
               <Table>
                  <TableHeader>
                     <TableRow>
                        <TableHead className="px-8">Nama</TableHead>
                        <TableHead>Deskripsi</TableHead>
                        <TableHead className="text-right px-8 w-20">Aksi</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {lics.map(l => (
                        <TableRow key={l.id}>
                           <TableCell className="px-8 font-bold">{l.name}</TableCell>
                           <TableCell className="text-xs text-muted-foreground line-clamp-1 max-w-[150px]">{l.description}</TableCell>
                           <TableCell className="text-right px-8">
                              <MasterDataDialog type="license" mode="edit" data={l} />
                           </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </div>
         </div>
      </div>

      {/* Release Info */}
      <div className="space-y-6">
         <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-3 text-primary font-bold uppercase tracking-widest text-xs">
               <Info size={16} /> Informasi Perilisan (Coming Soon)
            </div>
            <MasterDataDialog type="releaseInfo" mode="add" />
         </div>
         <div className="bg-background border border-border rounded-[2.5rem] overflow-hidden shadow-xl">
            <Table>
               <TableHeader className="bg-secondary/20">
                  <TableRow>
                     <TableHead className="px-8 h-14">Judul Info</TableHead>
                     <TableHead>Isi Informasi</TableHead>
                     <TableHead>Estimasi Rilis</TableHead>
                     <TableHead className="text-right px-8 w-20">Aksi</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {infos.map(info => (
                     <TableRow key={info.id} className="group">
                        <TableCell className="px-8 font-bold">{info.title}</TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-md truncate">{info.content}</TableCell>
                        <TableCell className="text-sm font-medium text-orange-600">{info.estimateDate || "Segera"}</TableCell>
                        <TableCell className="text-right px-8">
                           <MasterDataDialog type="releaseInfo" mode="edit" data={info} />
                        </TableCell>
                     </TableRow>
                  ))}
                  {infos.length === 0 && (
                    <TableRow>
                       <TableCell colSpan={4} className="text-center py-12 text-muted-foreground italic">Belum ada info perilisan.</TableCell>
                    </TableRow>
                  )}
               </TableBody>
            </Table>
         </div>
      </div>
    </div>
  );
}
