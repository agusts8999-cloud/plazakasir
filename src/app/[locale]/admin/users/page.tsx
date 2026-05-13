import { db } from "@/lib/db";
import { users, roles } from "@/db/schema";
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
import { UserRoleToggle } from "./UserRoleToggle";
import { UserDeleteButton } from "./UserDeleteButton";
import { UserDialog } from "./UserDialog";
import { RoleDialog } from "./roles/RoleDialog";
import { User, Shield, Mail, Lock, ShieldAlert, Key } from "lucide-react";

export default async function AdminUsersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const allUsers = await db.query.users.findMany({
    orderBy: [desc(users.id)],
    with: {
        roleData: true
    }
  });

  const allRoles = await db.select().from(roles);

  return (
    <div className="space-y-12 pb-20">
      {/* Section 1: Roles Management */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Daftar Peranan & Hak Akses</h2>
            <p className="text-sm text-muted-foreground mt-1">Konfigurasi izin akses khusus untuk setiap kategori staf.</p>
          </div>
          <RoleDialog mode="add" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {allRoles.map((r) => (
             <div key={r.id} className="p-5 bg-background border border-border rounded-xl shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-50">
                   <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-3 py-0.5 font-bold text-[10px] tracking-wide uppercase">
                      {r.name}
                   </Badge>
                   <RoleDialog mode="edit" role={r} />
                </div>
                <div className="space-y-3">
                   <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-1.5">
                      <Key size={12} className="opacity-50" /> Izin Akses:
                   </p>
                   <div className="flex flex-wrap gap-1.5">
                      {JSON.parse(r.permissions || "[]").map((p: string) => (
                        <span key={p} className="px-2.5 py-1 bg-muted/50 text-[10px] font-bold text-muted-foreground rounded border border-border/50 capitalize">
                           {p}
                        </span>
                      ))}
                      {JSON.parse(r.permissions || "[]").length === 0 && <span className="text-xs italic text-muted-foreground">Tanpa izin khusus</span>}
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>

      <div className="border-t border-border pt-12 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
             <h2 className="text-xl font-bold tracking-tight">Manajemen Akun Staf</h2>
             <p className="text-sm text-muted-foreground mt-1">Kelola kredensial login dan hubungkan dengan peranan sistem.</p>
          </div>
          <UserDialog roles={allRoles} mode="add" />
        </div>

        <div className="bg-background border border-border rounded-xl overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Pengguna</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider">Email (Kredensial)</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-wider">Status Peranan</TableHead>
                <TableHead className="text-right px-6 text-xs font-bold uppercase tracking-wider">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allUsers.map((u) => (
                <TableRow key={u.id} className="group hover:bg-muted/5 transition-colors border-b last:border-0">
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center border border-border overflow-hidden shrink-0">
                        {u.avatar ? (
                          <img src={u.avatar} alt={u.fullName || ""} className="w-full h-full object-cover" />
                        ) : (
                          <User className="text-muted-foreground/60" size={18} />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-foreground leading-none">{u.fullName || "Tanpa Nama"}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-mono mt-1.5">UID: {u.id.substring(0, 8)}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Mail size={12} className="text-primary/50" />
                      {u.email}
                    </div>
                  </TableCell>
                  <TableCell>
                     <UserRoleToggle userId={u.id} currentRoleId={u.roleId} roles={allRoles} />
                  </TableCell>
                  <TableCell className="text-right px-6">
                     <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <UserDialog roles={allRoles} user={u} mode="edit" />
                        <UserDeleteButton userId={u.id} />
                     </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
