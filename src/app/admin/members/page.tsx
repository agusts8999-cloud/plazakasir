import { db } from "@/lib/db";
import { members, categories, purchases, products } from "@/db/schema";
import { desc, eq, isNull } from "drizzle-orm";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ShieldCheck, User, Users, Users2, Search, Building2, Calendar, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { MemberDetailDialog } from "./MemberDetailDialog";
import { MemberDialog } from "./MemberDialog";
import { MemberDeleteButton } from "./MemberDeleteButton";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

export default async function AdminMembersPage({ 
  searchParams 
}: { 
  searchParams: { tab?: string } 
}) {
  const activeTab = searchParams.tab || "all";

  const allMembers = await db.query.members.findMany({
    where: isNull(members.deletedAt),
    orderBy: [desc(members.createdAt)],
    with: {
      businessCategory: true,
      purchases: {
        with: {
          product: true
        }
      }
    }
  });

  const dbCategories = await db.select().from(categories).where(isNull(categories.deletedAt));

  const filteredMembers = allMembers.filter(m => {
    if (activeTab === "all") return true;
    if (activeTab === "admin") return m.type === "ADMIN";
    if (activeTab === "user") return m.type === "USER";
    if (activeTab === "customer") return m.type === "CUSTOMER";
    return true;
  });

  const getTabCount = (type?: string) => {
    if (!type) return allMembers.length;
    return allMembers.filter(m => m.type === type).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manajemen Anggota</h1>
          <p className="text-sm text-muted-foreground mt-1">Kelola data mitra, admin, dan pelanggan PlazaKasir.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input placeholder="Cari anggota..." className="pl-10 h-10 rounded-lg border shadow-sm" />
           </div>
           <MemberDialog categories={dbCategories} mode="add" />
        </div>
      </div>

      <Tabs value={activeTab} className="w-full">
        <TabsList className="bg-muted/50 p-1 rounded-lg h-11 border border-border mb-6">
          <Link href="/admin/members?tab=all">
            <TabsTrigger value="all" className="rounded-md h-9 px-4 font-semibold text-xs gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Semua <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">{getTabCount()}</Badge>
            </TabsTrigger>
          </Link>
          <Link href="/admin/members?tab=admin">
            <TabsTrigger value="admin" className="rounded-md h-9 px-4 font-semibold text-xs gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Admin <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">{getTabCount("ADMIN")}</Badge>
            </TabsTrigger>
          </Link>
          <Link href="/admin/members?tab=user">
            <TabsTrigger value="user" className="rounded-md h-9 px-4 font-semibold text-xs gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Staff <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">{getTabCount("USER")}</Badge>
            </TabsTrigger>
          </Link>
          <Link href="/admin/members?tab=customer">
            <TabsTrigger value="customer" className="rounded-md h-9 px-4 font-semibold text-xs gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              Pelanggan <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">{getTabCount("CUSTOMER")}</Badge>
            </TabsTrigger>
          </Link>
        </TabsList>

      <div className="bg-background border border-border rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="px-6 py-4 text-xs uppercase font-bold tracking-wider">Anggota</TableHead>
              <TableHead className="text-xs uppercase font-bold tracking-wider">Tipe</TableHead>
              <TableHead className="text-xs uppercase font-bold tracking-wider">Bisnis</TableHead>
              <TableHead className="text-xs uppercase font-bold tracking-wider">Kontak</TableHead>
              <TableHead className="text-xs uppercase font-bold tracking-wider">Terdaftar</TableHead>
              <TableHead className="text-xs uppercase font-bold tracking-wider">Status</TableHead>
              <TableHead className="text-right px-6 text-xs uppercase font-bold tracking-wider">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.map((m) => (
              <TableRow key={m.id} className="group hover:bg-muted/5 transition-colors border-b last:border-0">
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center border border-primary/10 shrink-0 font-bold text-primary">
                       {m.fullName?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">{m.fullName}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-tight">{m.code || "PK-NEW"}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={
                    m.type === 'ADMIN' ? "bg-red-50 text-red-700 border-red-100" :
                    m.type === 'USER' ? "bg-blue-50 text-blue-700 border-blue-100" :
                    "bg-emerald-50 text-emerald-700 border-emerald-100"
                  }>
                    {m.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold">{m.businessName || "-"}</p>
                    <p className="text-[10px] text-muted-foreground">{m.businessCategory?.name || "General"}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-0.5 text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-1.5"><Mail size={10} /> {m.email}</div>
                    <div className="flex items-center gap-1.5"><Phone size={10} /> {m.phone}</div>
                  </div>
                </TableCell>
                <TableCell className="text-xs">
                   {m.registrationDate?.toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' })}
                </TableCell>
                <TableCell>
                   <Badge variant="outline" className={
                      m.status === 'ACTIVE' 
                      ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                      : "bg-red-50 text-red-600 border-red-200"
                   }>
                      {m.status}
                   </Badge>
                </TableCell>
                <TableCell className="text-right px-6">
                   <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MemberDetailDialog member={m} />
                      <MemberDialog categories={dbCategories} member={m} mode="edit" />
                      <MemberDeleteButton memberId={m.id} memberName={m.fullName || "Tanpa Nama"} />
                   </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredMembers.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                     <Users size={48} className="opacity-20" />
                     <p>Tidak ada anggota dalam kategori ini.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      </Tabs>
    </div>
  );
}
